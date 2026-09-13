/* GlucoGrow Cloud Layer
   Menghubungkan tampilan asli dengan penyimpanan permanen (akun, data anak,
   kunjungan, dan imunisasi). Tidak mengubah gaya tampilan yang sudah ada. */
(function () {
  const SUPABASE_URL = 'https://manyhhphzpygslzhpifh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_ujJNqPgc6Zra54Dgmgm1rg_NVZKSQNx';
  const EMAIL_DOMAIN = 'glucogrow.local';
  const PURPOSES = [
    'Penimbangan & Pemantauan Tumbuh Kembang',
    'Imunisasi / Suntikan',
    'Pemeriksaan Anak Sakit',
    'Konsultasi Gizi',
    'Pemberian Vitamin A / Obat Cacing',
    'Lainnya',
  ];
  const VACCINES = ['HB 0', 'BCG', 'Polio 1', 'Polio 2', 'Polio 3', 'Polio 4', 'DPT-HB-Hib 1', 'DPT-HB-Hib 2', 'DPT-HB-Hib 3', 'Campak / MR', 'PCV', 'Rotavirus', 'Booster DPT', 'Booster Campak', 'Lainnya'];

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  const gg = (window.gg = {
    client: sb,
    user: null,
    role: 'guest',
    profile: null,
    children: [],
    visits: [],
    immunizations: [],
    currentChild: null,
    search: '',
    adminTab: 'children',
    users: [],
  });

  const esc = (v) =>
    String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const el = (id) => document.getElementById(id);
  const toast = (m) => window.app.showToast(m);
  const isStaff = () => gg.role === 'health_worker' || gg.role === 'super_admin';
  const fmtDate = (d) => {
    if (!d) return '-';
    const p = String(d).slice(0, 10).split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : d;
  };
  const ageMonths = (dob) => window.app.calculateAgeMonths(dob);
  const statusFor = (age, height) => {
    if (!height) return null;
    const std = 75 + (age - 12) * 1.5;
    if (height < std - 5) return 'Stunting';
    if (height < std - 2) return 'Risiko';
    return 'Normal';
  };
  const badgeClass = (s) => (s === 'Stunting' ? 'status-danger' : s === 'Risiko' ? 'status-warning' : 'status-normal');

  /* ---------------- MODAL SHELL (dibuat dinamis, gaya mengikuti CSS asli) ---------------- */
  function ensureModal(id, maxWidth) {
    let m = el(id);
    if (m) return m;
    m = document.createElement('div');
    m.className = 'modal-overlay';
    m.id = id;
    m.onclick = (e) => window.app.closeModalOnOverlay(e);
    m.innerHTML = `<div class="modal-box" style="max-width:${maxWidth}px; text-align:left;" onclick="event.stopPropagation()"></div>`;
    document.body.appendChild(m);
    return m;
  }
  function openModal(id, maxWidth, html) {
    const m = ensureModal(id, maxWidth);
    m.querySelector('.modal-box').innerHTML = html;
    m.classList.add('active');
    return m;
  }
  const closeModal = (id) => el(id) && el(id).classList.remove('active');
  gg.closeModal = closeModal;

  /* ---------------- AUTH ---------------- */
  async function loadSession() {
    const { data } = await sb.auth.getSession();
    if (!data.session) return false;
    gg.user = data.session.user;
    const [{ data: roles }, { data: prof }] = await Promise.all([
      sb.from('user_roles').select('role').eq('user_id', gg.user.id),
      sb.from('profiles').select('*').eq('id', gg.user.id).maybeSingle(),
    ]);
    gg.role = roles && roles.length ? roles[0].role : 'parent';
    gg.profile = prof || null;
    window.app.state.isLoggedIn = true;
    window.app.state.role = gg.role === 'parent' ? 'parent' : 'admin';
    el('nav-login-btn').classList.add('hidden');
    el('nav-logout-btn').classList.remove('hidden');
    return true;
  }

  window.app.switchAuthTab = (tab) => {
    window.app.state.loginTab = tab;
    document.querySelectorAll('.auth-tab').forEach((e) => e.classList.remove('active'));
    const btn = el('tab-' + tab);
    if (btn) btn.classList.add('active');
    const signup = el('signup-fields');
    if (signup) signup.classList.toggle('hidden', tab !== 'signup');
    const submit = el('login-submit-btn');
    if (submit) submit.textContent = tab === 'signup' ? 'Daftar Akun Orang Tua' : 'Masuk';
    ['login-email', 'login-pass', 'signup-fullname', 'signup-phone'].forEach((id) => {
      if (el(id)) el(id).value = '';
    });
  };

  window.app.processLogin = async (event) => {
    if (event) event.preventDefault();
    if (window.app.state.loginTab === 'signup') return window.app.processSignup(event);
    const username = el('login-email').value.trim().toLowerCase();
    const password = el('login-pass').value;
    if (!username || !password) return toast('Mohon isi username dan password.');
    const { error } = await sb.auth.signInWithPassword({ email: `${username}@${EMAIL_DOMAIN}`, password });
    if (error) return toast('Username atau password salah.');
    await loadSession();
    if (gg.profile && gg.profile.is_active === false) {
      await sb.auth.signOut();
      return toast('Akun Anda dinonaktifkan. Hubungi Super Admin.');
    }
    if (window.app.state.loginTab === 'parent' && gg.role !== 'parent') {
      toast('Anda masuk sebagai tenaga kesehatan.');
    }
    window.app.toggleLogin(null);
    toast('Berhasil masuk sebagai ' + roleLabel(gg.role) + '.');
    window.app.router(gg.role === 'parent' ? 'dashboard' : 'admin', null);
  };

  window.app.processSignup = async (event) => {
    if (event) event.preventDefault();
    const username = el('login-email').value.trim().toLowerCase();
    const password = el('login-pass').value;
    const fullName = el('signup-fullname').value.trim();
    const phone = el('signup-phone').value.trim();
    if (!/^[a-z0-9._-]{3,40}$/.test(username)) return toast('Username minimal 3 karakter (huruf, angka, titik, garis).');
    if (password.length < 6) return toast('Password minimal 6 karakter.');
    if (!fullName) return toast('Mohon isi nama lengkap.');
    const { error } = await sb.auth.signUp({
      email: `${username}@${EMAIL_DOMAIN}`,
      password,
      options: { data: { username, full_name: fullName, phone } },
    });
    if (error) {
      return toast(error.message.includes('already') ? 'Username sudah digunakan.' : 'Pendaftaran gagal: ' + error.message);
    }
    const { error: signInErr } = await sb.auth.signInWithPassword({ email: `${username}@${EMAIL_DOMAIN}`, password });
    if (signInErr) {
      toast('Akun dibuat. Silakan masuk.');
      return window.app.switchAuthTab('parent');
    }
    await loadSession();
    window.app.toggleLogin(null);
    toast('Akun orang tua berhasil dibuat.');
    window.app.router('dashboard', null);
  };

  window.app.logout = async (event) => {
    if (event) event.preventDefault();
    await sb.auth.signOut();
    gg.user = null;
    gg.role = 'guest';
    gg.profile = null;
    gg.children = [];
    window.app.state.isLoggedIn = false;
    window.app.state.role = 'guest';
    el('nav-login-btn').classList.remove('hidden');
    el('nav-logout-btn').classList.add('hidden');
    toast('Anda telah keluar.');
    window.app.router('landing', null);
  };

  const roleLabel = (r) => (r === 'super_admin' ? 'Super Admin' : r === 'health_worker' ? 'Tenaga Kesehatan' : 'Orang Tua');
  gg.roleLabel = roleLabel;

  /* ---------------- ROUTER ---------------- */
  window.app.router = (viewName, event) => {
    if (event) event.preventDefault();
    const main = el('app-content');
    main.innerHTML = '';
    window.scrollTo(0, 0);
    if (viewName === 'landing') return window.app.renderLanding();
    if (viewName === 'education') return window.app.renderEducation();
    if (!gg.user) return window.app.toggleLogin(null);
    if (viewName === 'dashboard') return window.app.renderDashboard();
    if (viewName === 'admin') {
      if (!isStaff()) return window.app.renderDashboard();
      return window.app.renderAdmin();
    }
  };

  /* ---------------- DATA ---------------- */
  async function loadChildren() {
    const { data, error } = await sb
      .from('children')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast('Gagal memuat data anak.');
      gg.children = [];
      return;
    }
    gg.children = data || [];
  }
  async function loadChildDetail(childId) {
    const [{ data: visits }, { data: imm }] = await Promise.all([
      sb.from('visits').select('*').eq('child_id', childId).order('visit_date', { ascending: false }),
      sb.from('immunizations').select('*').eq('child_id', childId).order('given_date', { ascending: false }),
    ]);
    gg.visits = visits || [];
    gg.immunizations = imm || [];
  }
  const lastVisit = (childId) => gg.visits.find((v) => v.child_id === childId);

  /* ---------------- VIEW: DASHBOARD ORANG TUA (read-only) ---------------- */
  window.app.renderDashboard = async () => {
    const main = el('app-content');
    main.innerHTML = `<div class="container" style="padding:40px 20px;"><p style="color:var(--text-muted)">Memuat data...</p></div>`;
    await loadChildren();

    if (!gg.children.length) {
      main.innerHTML = `
        <div class="container" style="padding:40px 20px;">
          <div class="flex justify-between items-center mb-4">
            <div><h2 style="font-size:24px;">Dashboard Anak</h2><p style="color:var(--text-muted); font-size:14px;">${esc(roleLabel(gg.role))} • ${esc(gg.profile?.full_name || gg.profile?.username || '')}</p></div>
          </div>
          <div class="card text-center" style="padding:40px;">
            <i class="ph ph-baby" style="font-size:40px; color:var(--primary);"></i>
            <h3 style="margin:16px 0 8px;">Belum ada data anak yang terhubung</h3>
            <p style="color:var(--text-muted); font-size:14px;">Silakan minta tenaga kesehatan di posyandu untuk menghubungkan data anak Anda dengan username <strong>${esc(gg.profile?.username || '-')}</strong>.</p>
          </div>
        </div>`;
      return;
    }

    const cards = gg.children
      .map((c) => {
        const age = ageMonths(c.dob);
        return `
        <div class="card">
          <div class="card-header">
            <div><h3 class="card-title">${esc(c.name)}</h3><span style="font-size:12px; color:var(--text-muted);">${esc(c.gender === 'P' ? 'Perempuan' : 'Laki-laki')} • ${age} bln</span></div>
            <button class="btn btn-primary btn-sm" onclick="window.gg.openChild('${c.id}')"><i class="ph ph-eye"></i> Lihat Riwayat</button>
          </div>
          <div class="detail-grid" style="margin-bottom:0;">
            <div class="detail-item"><label>NIK</label><span>${esc(c.nik || '-')}</span></div>
            <div class="detail-item"><label>Tempat / Tgl Lahir</label><span>${esc(c.birth_place || '-')}, ${fmtDate(c.dob)}</span></div>
            <div class="detail-item"><label>Nama Orang Tua</label><span>${esc(c.parent_name || '-')}</span></div>
            <div class="detail-item"><label>No. Telepon</label><span>${esc(c.parent_phone || '-')}</span></div>
          </div>
        </div>`;
      })
      .join('');

    main.innerHTML = `
      <div class="container" style="padding:40px 20px;">
        <div class="flex justify-between items-center mb-4">
          <div><h2 style="font-size:24px;">Dashboard Anak</h2><p style="color:var(--text-muted); font-size:14px;">Data hanya dapat dilihat (tidak dapat diubah)</p></div>
          <button class="btn btn-outline" onclick="window.app.renderDashboard()"><i class="ph ph-arrows-clockwise"></i> Muat Ulang</button>
        </div>
        <div class="grid grid-2">${cards}</div>
      </div>`;
  };

  /* ---------------- VIEW: DASHBOARD TENAGA KESEHATAN ---------------- */
  window.app.renderAdmin = async () => {
    const main = el('app-content');
    main.innerHTML = `<div class="container" style="padding:40px 20px;"><p style="color:var(--text-muted)">Memuat data...</p></div>`;
    await loadChildren();
    renderAdminShell();
  };

  function renderAdminShell() {
    const main = el('app-content');
    const q = gg.search.trim().toLowerCase();
    const list = gg.children.filter(
      (c) => !q || (c.name || '').toLowerCase().includes(q) || (c.nik || '').includes(q) || (c.parent_name || '').toLowerCase().includes(q)
    );
    const rows =
      list
        .map((c) => {
          const age = ageMonths(c.dob);
          return `
        <tr>
          <td><strong>${esc(c.name)}</strong><br><span style="font-size:11px; color:var(--text-muted)">NIK ${esc(c.nik || '-')} • ${esc(c.gender === 'P' ? 'P' : 'L')}, ${age} bln</span></td>
          <td>${esc(c.parent_name || '-')}<br><span style="font-size:11px; color:var(--text-muted)">${esc(c.parent_phone || '-')}</span></td>
          <td>${fmtDate(c.dob)}<br><span style="font-size:11px; color:var(--text-muted)">${esc(c.birth_place || '-')}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.gg.openChild('${c.id}')"><i class="ph ph-eye"></i> Detail</button>
            <button class="btn btn-primary btn-sm" onclick="window.gg.openVisitForm('${c.id}')"><i class="ph ph-clipboard-text"></i> Kunjungan</button>
          </td>
        </tr>`;
        })
        .join('') || `<tr><td colspan="4" style="color:var(--text-muted)">Belum ada data anak.</td></tr>`;

    const superTab =
      gg.role === 'super_admin'
        ? `<button class="auth-tab ${gg.adminTab === 'users' ? 'active' : ''}" onclick="window.gg.setAdminTab('users')">Manajemen Pengguna</button>`
        : '';

    main.innerHTML = `
      <div class="container" style="padding:40px 20px;">
        <div class="flex justify-between items-center mb-4">
          <div><h2 style="font-size:24px;">Dashboard ${esc(roleLabel(gg.role))}</h2><p style="color:var(--text-muted); font-size:14px;">Posyandu • ${esc(gg.profile?.full_name || gg.profile?.username || '')}</p></div>
          <button class="btn btn-outline" onclick="window.print()"><i class="ph ph-printer"></i> Export Laporan</button>
        </div>
        <div class="auth-tabs mb-4" style="max-width:520px;">
          <button class="auth-tab ${gg.adminTab === 'children' ? 'active' : ''}" onclick="window.gg.setAdminTab('children')">Data Anak & Kunjungan</button>
          ${superTab}
        </div>
        <div id="admin-panel">
          ${
            gg.adminTab === 'users'
              ? `<div class="card"><p style="color:var(--text-muted)">Memuat pengguna...</p></div>`
              : `
          <div class="grid grid-3 mb-4">
            <div class="card" style="border-left:4px solid var(--primary); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Total Anak Terdaftar</p><h3 style="font-size:24px;">${gg.children.length}</h3></div>
            <div class="card" style="border-left:4px solid var(--info); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Hasil Pencarian</p><h3 style="font-size:24px;">${list.length}</h3></div>
            <div class="card" style="border-left:4px solid var(--warning); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Peran Akun</p><h3 style="font-size:18px;">${esc(roleLabel(gg.role))}</h3></div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Data Anak</h3>
              <div style="display:flex; gap:8px; align-items:center;">
                <input id="child-search" class="form-input" style="min-height:36px; padding:8px 12px; width:220px;" placeholder="Cari nama / NIK" value="${esc(gg.search)}" oninput="window.gg.onSearch(this.value)">
                <button class="btn btn-primary btn-sm" onclick="window.gg.openChildForm()"><i class="ph ph-plus"></i> Daftar Anak Baru</button>
              </div>
            </div>
            <div class="table-responsive"><table><thead><tr><th>Nama & Usia</th><th>Orang Tua</th><th>Lahir</th><th>Aksi</th></tr></thead><tbody>${rows}</tbody></table></div>
          </div>`
          }
        </div>
      </div>`;
    if (gg.adminTab === 'users') loadUsers();
  }

  gg.setAdminTab = (tab) => {
    gg.adminTab = tab;
    renderAdminShell();
  };
  let searchTimer = null;
  gg.onSearch = (v) => {
    gg.search = v;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      renderAdminShell();
      const inp = el('child-search');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    }, 250);
  };

  /* ---------------- FORM: DATA ANAK ---------------- */
  gg.openChildForm = (childId) => {
    const c = childId ? gg.children.find((x) => x.id === childId) : null;
    openModal(
      'gg-child-modal',
      560,
      `
      <div class="modal-header"><h3>${c ? 'Ubah Data Anak' : 'Daftar Anak Baru'}</h3>
        <button class="btn btn-outline btn-sm" onclick="window.gg.closeModal('gg-child-modal')"><i class="ph ph-x"></i></button></div>
      <div class="modal-body">
        <div class="grid grid-2" style="gap:0 16px;">
          <div class="form-group"><label class="form-label">NIK Anak</label><input id="ch-nik" class="form-input" placeholder="16 digit" value="${esc(c?.nik || '')}"></div>
          <div class="form-group"><label class="form-label">Nama Lengkap *</label><input id="ch-name" class="form-input" value="${esc(c?.name || '')}"></div>
          <div class="form-group"><label class="form-label">Tempat Lahir</label><input id="ch-birthplace" class="form-input" value="${esc(c?.birth_place || '')}"></div>
          <div class="form-group"><label class="form-label">Tanggal Lahir *</label><input type="date" id="ch-dob" class="form-input" value="${esc((c?.dob || '').slice(0, 10))}"></div>
          <div class="form-group"><label class="form-label">Jenis Kelamin</label><select id="ch-gender" class="form-select"><option value="L" ${c?.gender === 'L' ? 'selected' : ''}>Laki-laki</option><option value="P" ${c?.gender === 'P' ? 'selected' : ''}>Perempuan</option></select></div>
          <div class="form-group"><label class="form-label">Nama Orang Tua *</label><input id="ch-parent" class="form-input" value="${esc(c?.parent_name || '')}"></div>
          <div class="form-group"><label class="form-label">No. Telepon Orang Tua *</label><input id="ch-phone" class="form-input" value="${esc(c?.parent_phone || '')}"></div>
          <div class="form-group"><label class="form-label">Username Akun Orang Tua</label><input id="ch-username" class="form-input" placeholder="opsional, untuk akses orang tua"></div>
        </div>
        <div class="form-group"><label class="form-label">Catatan</label><textarea id="ch-notes" class="form-input" rows="2">${esc(c?.notes || '')}</textarea></div>
        <button class="btn btn-primary btn-full" onclick="window.gg.saveChild(${c ? `'${c.id}'` : 'null'})"><i class="ph ph-floppy-disk"></i> Simpan Data Anak</button>
      </div>`
    );
  };

  gg.saveChild = async (childId) => {
    const v = (id) => (el(id) ? el(id).value.trim() : '');
    const payload = {
      nik: v('ch-nik') || null,
      name: v('ch-name'),
      birth_place: v('ch-birthplace') || null,
      dob: v('ch-dob'),
      gender: el('ch-gender').value,
      parent_name: v('ch-parent') || null,
      parent_phone: v('ch-phone') || null,
      notes: v('ch-notes') || null,
    };
    if (!payload.name || !payload.dob) return toast('Nama dan tanggal lahir wajib diisi.');
    if (payload.nik && !/^\d{6,20}$/.test(payload.nik)) return toast('NIK harus berupa angka.');

    const username = v('ch-username').toLowerCase();
    if (username) {
      const { data: prof } = await sb.from('profiles').select('id').eq('username', username).maybeSingle();
      if (!prof) return toast('Username orang tua tidak ditemukan.');
      payload.parent_user_id = prof.id;
    }

    let error;
    if (childId) {
      ({ error } = await sb.from('children').update(payload).eq('id', childId));
    } else {
      payload.created_by = gg.user.id;
      ({ error } = await sb.from('children').insert(payload));
    }
    if (error) return toast('Gagal menyimpan: ' + error.message);
    closeModal('gg-child-modal');
    closeModal('gg-detail-modal');
    toast('Data anak tersimpan.');
    await loadChildren();
    renderAdminShell();
  };

  /* ---------------- FORM: PENDAFTARAN KUNJUNGAN ---------------- */
  gg.openVisitForm = async (childId) => {
    const c = gg.children.find((x) => x.id === childId);
    if (!c) return;
    gg.currentChild = c;
    await loadChildDetail(childId);
    const prev = gg.visits.length;
    const type = prev ? 'ulangan' : 'baru';
    const age = ageMonths(c.dob);
    const today = new Date().toISOString().slice(0, 10);
    const doseHint = {};
    gg.immunizations.forEach((i) => {
      doseHint[i.vaccine_name] = Math.max(doseHint[i.vaccine_name] || 0, i.dose_number);
    });

    openModal(
      'gg-visit-modal',
      600,
      `
      <div class="modal-header">
        <div><h3>Pendaftaran Kunjungan</h3><span style="font-size:12px; color:var(--text-muted);">${esc(c.name)} • ${age} bln • NIK ${esc(c.nik || '-')}</span></div>
        <button class="btn btn-outline btn-sm" onclick="window.gg.closeModal('gg-visit-modal')"><i class="ph ph-x"></i></button>
      </div>
      <div class="modal-body">
        <div class="card mb-4" style="box-shadow:none; padding:14px; background:var(--bg-body);">
          <span class="status-badge ${prev ? 'status-warning' : 'status-normal'}">${prev ? 'Kunjungan Ulangan' : 'Kunjungan Baru'}</span>
          <p style="font-size:12px; color:var(--text-muted); margin-top:8px;">Data identitas anak sudah terdaftar dan otomatis dipakai. Riwayat sebelumnya: ${prev} kunjungan, ${gg.immunizations.length} imunisasi.</p>
        </div>
        <div class="grid grid-2" style="gap:0 16px;">
          <div class="form-group"><label class="form-label">Tanggal Kunjungan</label><input type="date" id="vs-date" class="form-input" value="${today}"></div>
          <div class="form-group"><label class="form-label">Jenis Kunjungan</label><select id="vs-type" class="form-select"><option value="baru" ${type === 'baru' ? 'selected' : ''}>Kunjungan Baru</option><option value="ulangan" ${type === 'ulangan' ? 'selected' : ''}>Kunjungan Lama / Ulangan</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Kunjungan Untuk Apa? *</label>
          <select id="vs-purpose" class="form-select">${PURPOSES.map((p) => `<option>${esc(p)}</option>`).join('')}</select></div>
        <div class="grid grid-3" style="gap:0 16px;">
          <div class="form-group"><label class="form-label">Tinggi (cm)</label><input type="number" step="0.1" id="vs-height" class="form-input"></div>
          <div class="form-group"><label class="form-label">Berat (kg)</label><input type="number" step="0.1" id="vs-weight" class="form-input"></div>
          <div class="form-group"><label class="form-label">Lingkar Kepala (cm)</label><input type="number" step="0.1" id="vs-head" class="form-input"></div>
        </div>
        <div class="form-group"><label class="form-label">Hasil Pemeriksaan</label><textarea id="vs-findings" class="form-input" rows="2" placeholder="Temuan pemeriksaan"></textarea></div>
        <div class="form-group"><label class="form-label">Catatan / Tindakan</label><textarea id="vs-notes" class="form-input" rows="2"></textarea></div>
        <div class="card mb-4" style="box-shadow:none; padding:14px; background:var(--bg-body);">
          <label class="form-label" style="font-weight:700; color:var(--text-main);">Imunisasi / Suntikan pada kunjungan ini (opsional)</label>
          <div class="grid grid-2" style="gap:0 16px;">
            <div class="form-group"><label class="form-label">Jenis Suntikan</label><select id="vs-vaccine" class="form-select" onchange="window.gg.suggestDose()"><option value="">— tidak ada —</option>${VACCINES.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div>
            <div class="form-group"><label class="form-label">Suntikan Ke-</label><input type="number" min="1" id="vs-dose" class="form-input" value="1"></div>
          </div>
          <div class="form-group" style="margin-bottom:0;"><label class="form-label">Catatan Imunisasi</label><input id="vs-imm-notes" class="form-input"></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="window.gg.saveVisit('${c.id}')"><i class="ph ph-floppy-disk"></i> Simpan Kunjungan</button>
      </div>`
    );
    gg._doseHint = doseHint;
  };

  gg.suggestDose = () => {
    const name = el('vs-vaccine').value;
    if (!name) return;
    el('vs-dose').value = (gg._doseHint?.[name] || 0) + 1;
  };

  gg.saveVisit = async (childId) => {
    const c = gg.children.find((x) => x.id === childId);
    const num = (id) => (el(id).value ? parseFloat(el(id).value) : null);
    const date = el('vs-date').value || new Date().toISOString().slice(0, 10);
    const height = num('vs-height');
    const age = ageMonths(c.dob);
    const visit = {
      child_id: childId,
      visit_date: date,
      visit_type: el('vs-type').value,
      purpose: el('vs-purpose').value,
      age_months: age,
      height,
      weight: num('vs-weight'),
      head_circumference: num('vs-head'),
      status: statusFor(age, height),
      findings: el('vs-findings').value.trim() || null,
      notes: el('vs-notes').value.trim() || null,
      created_by: gg.user.id,
    };
    const { data: inserted, error } = await sb.from('visits').insert(visit).select('id').single();
    if (error) return toast('Gagal menyimpan kunjungan: ' + error.message);

    const vaccine = el('vs-vaccine').value;
    if (vaccine) {
      const { error: immErr } = await sb.from('immunizations').insert({
        child_id: childId,
        visit_id: inserted.id,
        vaccine_name: vaccine,
        dose_number: parseInt(el('vs-dose').value || '1', 10),
        given_date: date,
        notes: el('vs-imm-notes').value.trim() || null,
        created_by: gg.user.id,
      });
      if (immErr) toast('Kunjungan tersimpan, imunisasi gagal: ' + immErr.message);
    }
    closeModal('gg-visit-modal');
    toast('Kunjungan tersimpan sebagai riwayat baru.');
    await gg.openChild(childId);
  };

  /* ---------------- FORM: IMUNISASI TAMBAHAN ---------------- */
  gg.openImmForm = (childId) => {
    openModal(
      'gg-imm-modal',
      460,
      `
      <div class="modal-header"><h3>Catat Imunisasi</h3><button class="btn btn-outline btn-sm" onclick="window.gg.closeModal('gg-imm-modal')"><i class="ph ph-x"></i></button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Jenis Suntikan *</label><select id="im-vaccine" class="form-select">${VACCINES.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div>
        <div class="grid grid-2" style="gap:0 16px;">
          <div class="form-group"><label class="form-label">Suntikan Ke- *</label><input type="number" min="1" id="im-dose" class="form-input" value="1"></div>
          <div class="form-group"><label class="form-label">Tanggal *</label><input type="date" id="im-date" class="form-input" value="${new Date().toISOString().slice(0, 10)}"></div>
        </div>
        <div class="form-group"><label class="form-label">Catatan</label><input id="im-notes" class="form-input"></div>
        <div class="form-group"><label class="form-label">Hubungkan ke kunjungan</label>
          <select id="im-visit" class="form-select"><option value="">— tanpa kunjungan —</option>${gg.visits
            .map((v) => `<option value="${v.id}">${fmtDate(v.visit_date)} • ${esc(v.purpose)}</option>`)
            .join('')}</select></div>
        <button class="btn btn-primary btn-full" onclick="window.gg.saveImm('${childId}')">Simpan Imunisasi</button>
      </div>`
    );
  };

  gg.saveImm = async (childId) => {
    const { error } = await sb.from('immunizations').insert({
      child_id: childId,
      visit_id: el('im-visit').value || null,
      vaccine_name: el('im-vaccine').value,
      dose_number: parseInt(el('im-dose').value || '1', 10),
      given_date: el('im-date').value,
      notes: el('im-notes').value.trim() || null,
      created_by: gg.user.id,
    });
    if (error) return toast('Gagal menyimpan imunisasi: ' + error.message);
    closeModal('gg-imm-modal');
    toast('Imunisasi tercatat.');
    await gg.openChild(childId);
  };

  /* ---------------- DETAIL ANAK ---------------- */
  gg.openChild = async (childId) => {
    let c = gg.children.find((x) => x.id === childId);
    if (!c) {
      await loadChildren();
      c = gg.children.find((x) => x.id === childId);
      if (!c) return toast('Data anak tidak ditemukan.');
    }
    gg.currentChild = c;
    await loadChildDetail(childId);
    const age = ageMonths(c.dob);
    const latest = gg.visits.find((v) => v.height) || gg.visits[0] || {};
    const staff = isStaff();

    const visitRows =
      gg.visits
        .map(
          (v) => `
      <tr>
        <td>${fmtDate(v.visit_date)}<br><span style="font-size:11px; color:var(--text-muted)">${esc(v.visit_type === 'baru' ? 'Kunjungan Baru' : 'Ulangan')}</span></td>
        <td>${esc(v.purpose)}</td>
        <td>${v.height ?? '-'} cm / ${v.weight ?? '-'} kg</td>
        <td>${v.status ? `<span class="status-badge ${badgeClass(v.status)}">${esc(v.status)}</span>` : '-'}</td>
        <td><button class="btn btn-outline btn-sm" onclick="window.gg.openVisitDetail('${v.id}')"><i class="ph ph-eye"></i></button></td>
      </tr>`
        )
        .join('') || `<tr><td colspan="5" style="color:var(--text-muted)">Belum ada riwayat kunjungan.</td></tr>`;

    const immRows =
      gg.immunizations
        .map(
          (i) => `
      <tr><td>${fmtDate(i.given_date)}</td><td><strong>${esc(i.vaccine_name)}</strong></td><td>Suntikan ke-${i.dose_number}</td><td>${esc(i.notes || '-')}</td></tr>`
        )
        .join('') || `<tr><td colspan="4" style="color:var(--text-muted)">Belum ada catatan imunisasi.</td></tr>`;

    openModal(
      'gg-detail-modal',
      760,
      `
      <div class="modal-header">
        <div><h3 style="font-size:18px;">${esc(c.name)}</h3><span style="font-size:12px; color:var(--text-muted);">NIK ${esc(c.nik || '-')} • ${age} bln • ${esc(c.gender === 'P' ? 'Perempuan' : 'Laki-laki')}</span></div>
        <button class="btn btn-outline btn-sm" onclick="window.gg.closeModal('gg-detail-modal')"><i class="ph ph-x"></i></button>
      </div>
      <div class="modal-body">
        <div class="auth-tabs mb-4">
          <button class="auth-tab active" id="gg-tab-info" onclick="window.gg.detailTab('info')">Identitas</button>
          <button class="auth-tab" id="gg-tab-visits" onclick="window.gg.detailTab('visits')">Riwayat Kunjungan</button>
          <button class="auth-tab" id="gg-tab-imm" onclick="window.gg.detailTab('imm')">Imunisasi</button>
          <button class="auth-tab" id="gg-tab-chart" onclick="window.gg.detailTab('chart')">Grafik</button>
        </div>

        <div id="gg-sec-info" class="gg-section">
          <div class="detail-grid">
            <div class="detail-item"><label>Nama Lengkap</label><span>${esc(c.name)}</span></div>
            <div class="detail-item"><label>NIK</label><span>${esc(c.nik || '-')}</span></div>
            <div class="detail-item"><label>Tempat Lahir</label><span>${esc(c.birth_place || '-')}</span></div>
            <div class="detail-item"><label>Tanggal Lahir</label><span>${fmtDate(c.dob)} (${age} bln)</span></div>
            <div class="detail-item"><label>Nama Orang Tua</label><span>${esc(c.parent_name || '-')}</span></div>
            <div class="detail-item"><label>No. Telepon Orang Tua</label><span>${esc(c.parent_phone || '-')}</span></div>
            <div class="detail-item"><label>Pengukuran Terakhir</label><span>${latest.height ?? '-'} cm / ${latest.weight ?? '-'} kg</span></div>
            <div class="detail-item"><label>Status Gizi</label><span class="status-badge ${badgeClass(latest.status)}">${esc(latest.status || 'Belum ada')}</span></div>
            <div class="detail-item" style="grid-column: span 2;"><label>Catatan</label><span>${esc(c.notes || '-')}</span></div>
          </div>
          ${
            staff
              ? `<div class="flex" style="gap:8px; flex-wrap:wrap;">
                  <button class="btn btn-outline" onclick="window.gg.openChildForm('${c.id}')"><i class="ph ph-pencil-simple"></i> Edit Identitas</button>
                  <button class="btn btn-primary" onclick="window.gg.openVisitForm('${c.id}')"><i class="ph ph-clipboard-text"></i> Kunjungan Baru</button>
                  <button class="btn btn-outline" onclick="window.gg.openImmForm('${c.id}')"><i class="ph ph-syringe"></i> Catat Imunisasi</button>
                </div>`
              : `<p style="font-size:12px; color:var(--text-muted);">Akun orang tua hanya dapat melihat data. Perubahan data pemeriksaan dan imunisasi dilakukan oleh tenaga kesehatan.</p>`
          }
        </div>

        <div id="gg-sec-visits" class="gg-section hidden">
          <div class="table-responsive"><table><thead><tr><th>Tanggal</th><th>Tujuan Kunjungan</th><th>TB/BB</th><th>Status</th><th></th></tr></thead><tbody>${visitRows}</tbody></table></div>
          ${staff ? `<div class="mt-4"><button class="btn btn-primary btn-sm" onclick="window.gg.openVisitForm('${c.id}')"><i class="ph ph-plus"></i> Tambah Kunjungan</button></div>` : ''}
        </div>

        <div id="gg-sec-imm" class="gg-section hidden">
          <div class="table-responsive"><table><thead><tr><th>Tanggal</th><th>Jenis Suntikan</th><th>Urutan</th><th>Catatan</th></tr></thead><tbody>${immRows}</tbody></table></div>
          ${staff ? `<div class="mt-4"><button class="btn btn-primary btn-sm" onclick="window.gg.openImmForm('${c.id}')"><i class="ph ph-plus"></i> Catat Imunisasi</button></div>` : ''}
        </div>

        <div id="gg-sec-chart" class="gg-section hidden">
          <div class="chart-container"><canvas id="patientChart"></canvas></div>
          <p style="font-size:12px; color:var(--text-muted); text-align:center; margin-top:10px;">Grafik riwayat pertumbuhan (Tinggi & Berat)</p>
        </div>
      </div>`
    );
  };

  gg.detailTab = (tab) => {
    document.querySelectorAll('.gg-section').forEach((s) => s.classList.add('hidden'));
    el('gg-sec-' + tab).classList.remove('hidden');
    ['info', 'visits', 'imm', 'chart'].forEach((t) => el('gg-tab-' + t).classList.toggle('active', t === tab));
    if (tab === 'chart') {
      const history = gg.visits
        .filter((v) => v.height && v.weight)
        .map((v) => ({ age: v.age_months ?? 0, h: Number(v.height), w: Number(v.weight) }))
        .sort((a, b) => a.age - b.age);
      setTimeout(() => window.app.drawPatientChart(history), 60);
    }
  };

  gg.openVisitDetail = (visitId) => {
    const v = gg.visits.find((x) => x.id === visitId);
    if (!v) return;
    const imm = gg.immunizations.filter((i) => i.visit_id === visitId);
    openModal(
      'gg-visit-detail-modal',
      520,
      `
      <div class="modal-header"><div><h3>Detail Pemeriksaan</h3><span style="font-size:12px; color:var(--text-muted);">${fmtDate(v.visit_date)} • ${esc(v.visit_type === 'baru' ? 'Kunjungan Baru' : 'Kunjungan Ulangan')}</span></div>
        <button class="btn btn-outline btn-sm" onclick="window.gg.closeModal('gg-visit-detail-modal')"><i class="ph ph-x"></i></button></div>
      <div class="modal-body">
        <div class="detail-grid">
          <div class="detail-item"><label>Tujuan Kunjungan</label><span>${esc(v.purpose)}</span></div>
          <div class="detail-item"><label>Usia Saat Kunjungan</label><span>${v.age_months ?? '-'} bln</span></div>
          <div class="detail-item"><label>Tinggi</label><span>${v.height ?? '-'} cm</span></div>
          <div class="detail-item"><label>Berat</label><span>${v.weight ?? '-'} kg</span></div>
          <div class="detail-item"><label>Lingkar Kepala</label><span>${v.head_circumference ?? '-'} cm</span></div>
          <div class="detail-item"><label>Status Gizi</label><span class="status-badge ${badgeClass(v.status)}">${esc(v.status || '-')}</span></div>
          <div class="detail-item" style="grid-column: span 2;"><label>Hasil Pemeriksaan</label><span>${esc(v.findings || '-')}</span></div>
          <div class="detail-item" style="grid-column: span 2;"><label>Catatan</label><span>${esc(v.notes || '-')}</span></div>
          <div class="detail-item" style="grid-column: span 2;"><label>Imunisasi pada kunjungan ini</label><span>${
            imm.length ? imm.map((i) => `${esc(i.vaccine_name)} (ke-${i.dose_number})`).join(', ') : 'Tidak ada'
          }</span></div>
        </div>
      </div>`
    );
  };

  /* ---------------- SUPER ADMIN: MANAJEMEN PENGGUNA ---------------- */
  async function adminApi(payload) {
    const { data } = await sb.auth.getSession();
    const res = await fetch(window.location.origin + '/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token || ''}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Permintaan gagal');
    return json;
  }

  async function loadUsers() {
    try {
      const { users } = await adminApi({ action: 'list_users' });
      gg.users = users || [];
    } catch (e) {
      toast(e.message);
      gg.users = [];
    }
    renderUsersPanel();
  }

  function renderUsersPanel() {
    const panel = el('admin-panel');
    if (!panel) return;
    const rows =
      gg.users
        .map(
          (u) => `
      <tr>
        <td><strong>${esc(u.username)}</strong><br><span style="font-size:11px; color:var(--text-muted)">${esc(u.full_name || '-')} • ${esc(u.phone || '-')}</span></td>
        <td>
          <select class="form-select" style="min-height:34px; padding:6px 10px; font-size:12px;" onchange="window.gg.changeRole('${u.id}', this.value)">
            ${['parent', 'health_worker', 'super_admin']
              .map((r) => `<option value="${r}" ${u.role === r ? 'selected' : ''}>${esc(roleLabel(r))}</option>`)
              .join('')}
          </select>
        </td>
        <td><span class="status-badge ${u.is_active ? 'status-normal' : 'status-danger'}">${u.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
        <td style="white-space:nowrap;">
          <button class="btn btn-outline btn-sm" onclick="window.gg.toggleActive('${u.id}', ${!u.is_active})"><i class="ph ph-power"></i> ${u.is_active ? 'Nonaktifkan' : 'Aktifkan'}</button>
          <button class="btn btn-outline btn-sm" onclick="window.gg.resetPassword('${u.id}','${esc(u.username)}')"><i class="ph ph-key"></i> Sandi</button>
          <button class="btn btn-danger btn-sm" onclick="window.gg.deleteUser('${u.id}','${esc(u.username)}')"><i class="ph ph-trash"></i></button>
        </td>
      </tr>`
        )
        .join('') || `<tr><td colspan="4" style="color:var(--text-muted)">Belum ada pengguna.</td></tr>`;

    panel.innerHTML = `
      <div class="grid grid-3 mb-4">
        <div class="card" style="border-left:4px solid var(--primary); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Total Pengguna</p><h3 style="font-size:24px;">${gg.users.length}</h3></div>
        <div class="card" style="border-left:4px solid var(--info); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Tenaga Kesehatan</p><h3 style="font-size:24px;">${gg.users.filter((u) => u.role === 'health_worker').length}</h3></div>
        <div class="card" style="border-left:4px solid var(--warning); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Orang Tua</p><h3 style="font-size:24px;">${gg.users.filter((u) => u.role === 'parent').length}</h3></div>
      </div>
      <div class="card mb-4">
        <div class="card-header"><h3 class="card-title">Buat Akun Tenaga Kesehatan</h3></div>
        <div class="grid grid-2" style="gap:0 16px;">
          <div class="form-group"><label class="form-label">Username *</label><input id="su-username" class="form-input" placeholder="mis. kader01"></div>
          <div class="form-group"><label class="form-label">Password *</label><input id="su-password" class="form-input" placeholder="minimal 6 karakter"></div>
          <div class="form-group"><label class="form-label">Nama Lengkap</label><input id="su-fullname" class="form-input"></div>
          <div class="form-group"><label class="form-label">No. Telepon</label><input id="su-phone" class="form-input"></div>
          <div class="form-group"><label class="form-label">Hak Akses</label><select id="su-role" class="form-select"><option value="health_worker">Tenaga Kesehatan</option><option value="super_admin">Super Admin</option></select></div>
        </div>
        <button class="btn btn-primary" style="align-self:flex-start;" onclick="window.gg.createStaff()"><i class="ph ph-user-plus"></i> Buat Akun</button>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">Daftar Pengguna & Hak Akses</h3>
          <button class="btn btn-outline btn-sm" onclick="window.gg.reloadUsers()"><i class="ph ph-arrows-clockwise"></i> Muat Ulang</button></div>
        <div class="table-responsive"><table><thead><tr><th>Pengguna</th><th>Hak Akses</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows}</tbody></table></div>
      </div>`;
  }

  gg.reloadUsers = loadUsers;
  gg.createStaff = async () => {
    const username = el('su-username').value.trim().toLowerCase();
    const password = el('su-password').value;
    if (!/^[a-z0-9._-]{3,40}$/.test(username)) return toast('Username tidak valid.');
    if (password.length < 6) return toast('Password minimal 6 karakter.');
    try {
      await adminApi({
        action: 'create_staff',
        username,
        password,
        full_name: el('su-fullname').value.trim() || undefined,
        phone: el('su-phone').value.trim() || undefined,
        role: el('su-role').value,
      });
      toast('Akun berhasil dibuat.');
      loadUsers();
    } catch (e) {
      toast(e.message);
    }
  };
  gg.changeRole = async (user_id, role) => {
    try {
      await adminApi({ action: 'set_role', user_id, role });
      toast('Hak akses diperbarui.');
      loadUsers();
    } catch (e) {
      toast(e.message);
      loadUsers();
    }
  };
  gg.toggleActive = async (user_id, is_active) => {
    try {
      await adminApi({ action: 'set_active', user_id, is_active });
      toast(is_active ? 'Akun diaktifkan.' : 'Akun dinonaktifkan.');
      loadUsers();
    } catch (e) {
      toast(e.message);
    }
  };
  gg.resetPassword = async (user_id, username) => {
    const password = prompt(`Password baru untuk ${username} (minimal 6 karakter):`);
    if (!password) return;
    if (password.length < 6) return toast('Password minimal 6 karakter.');
    try {
      await adminApi({ action: 'reset_password', user_id, password });
      toast('Password diperbarui.');
    } catch (e) {
      toast(e.message);
    }
  };
  gg.deleteUser = async (user_id, username) => {
    if (!confirm(`Hapus akun ${username}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await adminApi({ action: 'delete_user', user_id });
      toast('Akun dihapus.');
      loadUsers();
    } catch (e) {
      toast(e.message);
    }
  };

  /* ---------------- NONAKTIFKAN JALUR DEMO LAMA ---------------- */
  window.app.openAddPatientModal = () => gg.openChildForm();
  window.app.saveNewPatient = () => gg.saveChild(null);
  window.app.openPatientDetail = (id) => gg.openChild(id);

  /* ---------------- INIT ---------------- */
  const originalInit = window.app.init;
  window.app.init = async () => {
    originalInit();
    const ok = await loadSession();
    if (ok) window.app.router(gg.role === 'parent' ? 'dashboard' : 'admin', null);
  };
  if (document.readyState !== 'loading') window.app.init();
})();
