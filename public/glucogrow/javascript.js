        // --- DATABASE ARTIKEL (MENYESUAIKAN KEMENKES & WHO) ---
        const articlesDB = [
            {
                id: 1, 
                title: "1000 Hari Pertama Kehidupan (HPK)", 
                category: "Perkembangan", 
                img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=700&auto=format&fit=crop",
                summary: "Masa emas penentu kualitas hidup anak di masa depan.",
                content: `<p><strong>1000 HPK</strong> dihitung sejak awal kehamilan (270 hari) hingga ulang tahun kedua anak (730 hari). Menurut WHO, periode ini adalah kesempatan terbaik untuk mencegah stunting.</p><br><p><strong>Tahapan Kritis:</strong></p><ul><li>0-6 Bulan: ASI Eksklusif.</li><li>6-24 Bulan: MPASI berkualitas.</li></ul>`,
                readTime: "4 min",
                source: "Kemenkes RI"
            },
            {
                id: 2, 
                title: "Panduan MPASI Sesuai WHO", 
                category: "Nutrisi", 
                img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=700&auto=format&fit=crop",
                summary: "Kapan dan bagaimana memperkenalkan makanan padat?",
                content: `<p>WHO menyarankan pemberian MPASI dimulai saat bayi berusia <strong>6 bulan</strong>. Saat ini, ASI saja tidak lagi cukup untuk memenuhi kebutuhan energi dan gizi.</p><br><p><strong>Prinsip MPASI:</strong></p><ul><li>Tepat Waktu (Usia 6 bulan).</li><li>Ampuh (Konsistensi tekstur sesuai usia).</li><li>Aman (Higienis).</li></ul>`,
                readTime: "5 min",
                source: "WHO Guidelines"
            },
            {
                id: 3, 
                title: "Pentingnya Inisiasi Menyusu Dini (IMD)", 
                category: "Parenting", 
                img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=700&auto=format&fit=crop",
                summary: "Menyusui dalam 1 jam pertama kelahiran menyelamatkan nyawa.",
                content: `<p>IMD adalah bayi mulai menyusu pada ibu dalam waktu 1 jam pertama setelah lahir. Manfaatnya sangat luar biasa:</p><ul><li>Mencegah kematian bayi baru lahir.</li><li>Meningkatkan keberhasilan pemberian ASI eksklusif.</li><li>Mencegah hipoglikemia.</li></ul>`,
                readTime: "3 min",
                source: "Pedoman SKD"
            },
            {
                id: 4, 
                title: "Jadwal Imunisasi Dasar Lengkap", 
                category: "Imunisasi", 
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=700&auto=format&fit=crop",
                summary: "Daftar vaksin wajib sesuai program imunisasi pemerintah.",
                content: `<p>Imunisasi dasar lengkap (IDL) mencakup Hepatitis B, BCG, Polio, DPT-HB-Hib, dan MR. Pastikan buku KIA anak Anda tercatat dengan benar di Posyandu atau Puskesmas terdekat.</p>`,
                readTime: "6 min",
                source: "Kemenkes RI"
            }
        ];

        const dailyTips = [
            { icon: "baby", text: "Cek berat badan rutin setiap bulan di Posyandu.", color: "bg-protein" },
            { icon: "drop", text: "Pastikan ASI eksklusif 6 bulan pertama.", color: "bg-carbs" },
            { icon: "smiley", text: "Berikan stimulasi bermain dan bicara.", color: "bg-vitamins" }
        ];

        // --- DATA DUMMY ---
        const dummyNutrition = [
            { name: "Bubur Daging Sapi", desc: "Sumber Zat Besi Tinggi", icon: "bowl-food", color: "bg-protein" },
            { name: "Telur Rebus", desc: "Protein Hewani", icon: "egg", color: "bg-protein" },
            { name: "Puree Alpukat", desc: "Lemak Sehat & Vit E", icon: "plant", color: "bg-vitamins" }
        ];

        const dummyImmunization = [
            { name: "HB 0", age: "0 Bln", done: true },
            { name: "BCG", age: "0 Bln", done: true },
            { name: "Polio 1", age: "1 Bln", done: true },
            { name: "Polio 2", age: "2 Bln", done: true },
            { name: "DPT 1", age: "2 Bln", done: true },
            { name: "Polio 3", age: "3 Bln", done: false },
            { name: "DPT 2", age: "3 Bln", done: false }
        ];

        // Main Application Logic
        window.app = {
            state: {
                isLoggedIn: false, 
                role: 'parent', 
                loginTab: 'parent', 
                theme: 'light', 
                history: [
                    { date: "01/02/2026", age: 0, height: 50, weight: 3.2, status: "Normal" },
                    { date: "01/03/2026", age: 1, height: 54, weight: 3.8, status: "Normal" },
                    { date: "01/04/2026", age: 2, height: 57, weight: 4.5, status: "Normal" },
                    { date: "29/05/2026", age: 4, height: 60, weight: 5.5, status: "Stunting" }
                ], 
                articles: articlesDB,
                patients: [
                    { id: 1, name: "Ema", dob: "2023-07-20", age: 10, height: 78, weight: 7.0, status: "Normal", gender: "P", notes: "Aktif dan lincah", history: [{age:6, h:65, w:6.5}, {age:8, h:72, w:6.8}, {age:10, h:78, w:7.0}] },
                    { id: 2, name: "Budi Santoso", dob: "2023-05-29", age: 12, height: 72, weight: 9.0, status: "Normal", gender: "L", notes: "Nafsu makan baik", history: [{age:8, h:68, w:8.0}, {age:10, h:70, w:8.5}, {age:12, h:72, w:9.0}] },
                    { id: 3, name: "Siti Aminah", dob: "2023-11-29", age: 6, height: 62, weight: 6.5, status: "Risiko", gender: "P", notes: "Sering batuk pilek", history: [{age:4, h:58, w:6.0}, {age:6, h:62, w:6.5}] },
                    { id: 4, name: "Rizky Ramadhan", dob: "2023-01-15", age: 16, height: 74, weight: 8.2, status: "Stunting", gender: "L", notes: "Perlu asupan protein tinggi", history: [{age:12, h:70, w:7.5}, {age:14, h:72, w:7.8}, {age:16, h:74, w:8.2}] }
                ],
                currentPatientId: null,
                chatHistory: []
            },

            init: () => {
                window.app.renderLanding();
                window.app.checkTheme();
            },

            // --- HELPER ---
            calculateAgeMonths: (dobString) => {
                if(!dobString) return 0;
                const dob = new Date(dobString);
                const today = new Date();
                let months = (today.getFullYear() - dob.getFullYear()) * 12;
                months -= dob.getMonth();
                months += today.getMonth();
                return months <= 0 ? 0 : months;
            },

            // --- ROUTER ---
            router: (viewName, event) => {
                if(event) event.preventDefault();
                const main = document.getElementById('app-content');
                main.innerHTML = '';
                window.scrollTo(0,0);

                if (viewName === 'landing') window.app.renderLanding();
                else if (viewName === 'dashboard') {
                    if (!window.app.state.isLoggedIn) return window.app.toggleLogin(null);
                    window.app.renderDashboard();
                }
                else if (viewName === 'education') window.app.renderEducation();
                else if (viewName === 'admin') {
                    if (window.app.state.role !== 'admin' && window.app.state.isLoggedIn) return window.app.toggleLogin(null);
                    window.app.renderAdmin();
                }
            },

            // --- AUTH ---
            toggleLogin: (event) => {
                if(event) event.preventDefault();
                const modal = document.getElementById('login-modal');
                const isActive = modal.classList.contains('active');
                if(!isActive) window.app.switchAuthTab('parent'); 
                modal.classList.toggle('active');
            },
            authCredentials: {
                parent: { username: 'orangtua', password: '12345' },
                admin: { username: 'admin', password: '54321' },
                cadre: { username: 'admin', password: '54321' }
            },
            switchAuthTab: (tab) => {
                window.app.state.loginTab = tab;
                document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
                if(tab === 'parent') document.getElementById('tab-parent').classList.add('active');
                else document.getElementById('tab-cadre').classList.add('active');
                
                document.getElementById('login-email').value = '';
                document.getElementById('login-pass').value = '';
            },
            processLogin: (event) => {
                if(event) event.preventDefault();
                const username = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-pass').value.trim();
                const activeRole = window.app.state.loginTab;
                const creds = window.app.authCredentials[activeRole];

                if (!username || !password) {
                    window.app.showToast('Mohon isi username dan password.');
                    return;
                }

                if (username !== creds.username || password !== creds.password) {
                    window.app.showToast('Username atau password salah.');
                    return;
                }

                window.app.state.isLoggedIn = true;
                if(activeRole === 'parent') {
                    window.app.state.role = 'parent';
                    window.app.showToast('Berhasil Masuk sebagai Orang Tua!');
                    window.app.router('dashboard', null);
                } else if (activeRole === 'cadre' || activeRole === 'admin') {
                    window.app.state.role = 'admin';
                    window.app.showToast('Masuk sebagai Tenaga Kesehatan.');
                    window.app.router('admin', null);
                } else {
                    window.app.showToast('Peran login tidak valid.');
                    return;
                }
                document.getElementById('nav-login-btn').classList.add('hidden');
                document.getElementById('nav-logout-btn').classList.remove('hidden');
                window.app.toggleLogin(null);
            },
            logout: (event) => {
                if(event) event.preventDefault();
                window.app.state.isLoggedIn = false;
                window.app.state.role = 'guest';
                document.getElementById('nav-login-btn').classList.remove('hidden');
                document.getElementById('nav-logout-btn').classList.add('hidden');
                window.app.showToast('Anda telah keluar.');
                window.app.router('landing', null);
            },
            closeModalOnOverlay: (e) => {
                if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
            },

            // --- VIEW: LANDING (REPAIRED) ---
            renderLanding: () => {
                const main = document.getElementById('app-content');
                main.innerHTML = `
                    <section class="hero container">
                        <div class="hero-text">
                            <div style="display:inline-flex; align-items:center; gap:8px; padding: 8px 16px; background: rgba(46, 191, 165, 0.1); color: var(--primary); border-radius: 30px; font-size: 13px; font-weight: 600; margin-bottom: 24px; border: 1px solid rgba(46, 191, 165, 0.2);">
                                <i class="ph-fill ph-sparkle"></i> Platform Nutrisi Cerdas #1
                            </div>
                            <h1>Cegah Stunting dengan <br><span style="color: var(--primary); position:relative; display:inline-block;">
                                Monitoring Cerdas
                                <span style="position:absolute; bottom:2px; left:0; width:100%; height:8px; background:rgba(46, 191, 165, 0.2); z-index:-1; border-radius:4px;"></span>
                            </span></h1>
                            <p>Bantu pantau pertumbuhan balita secara akurat, deteksi dini risiko stunting, dan dapatkan rekomendasi gizi personal berbasis AI untuk masa depan buah hati Anda.</p>
                            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
                                <button class="btn btn-primary" style="padding: 14px 32px; font-size:16px;" onclick="window.app.toggleLogin(null)">
                                    Mulai Monitoring <i class="ph ph-arrow-right" style="font-weight:700;"></i>
                                </button>
                                <button class="btn btn-outline" style="padding: 14px 32px; font-size:16px;" onclick="window.app.router('education', null)">
                                    Pelajari Stunting
                                </button>
                            </div>
                        </div>
                        <div class="hero-img">
                            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600&auto=format&fit=crop" alt="Dokter Memeriksa Balita">
                            <div class="floating-card fc-1">
                                <div style="width:40px; height:40px; background:rgba(46,191,165,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--primary);"><i class="ph-fill ph-heart-beat" style="font-size:20px;"></i></div>
                                <div><div style="font-size:12px; color:var(--text-muted);">Status</div><div style="font-weight:700; color:var(--text-main);">Sehat</div></div>
                            </div>
                            <div class="floating-card fc-2">
                                <div style="width:40px; height:40px; background:rgba(255,193,7,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#D4a017;"><i class="ph-fill ph-chart-line-up" style="font-size:20px;"></i></div>
                                <div><div style="font-size:12px; color:var(--text-muted);">Pertumbuhan</div><div style="font-weight:700; color:var(--text-main);">+5% Normal</div></div>
                            </div>
                        </div>
                    </section>
                    
                    <div style="background:white; padding: 40px 0; margin-top: -40px; position: relative; z-index: 10; border-radius: 30px 30px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.02);">
                        <div class="container">
                            <div class="text-center mb-4">
                                <h2 style="font-size: 32px; margin-bottom: 10px;">Kenapa GlucoGrow?</h2>
                                <p style="color: var(--text-muted);">Teknologi kesehatan terpadu berbasis standar WHO.</p>
                            </div>
                            <div class="grid grid-3">
                                <div class="card text-center" style="padding: 32px 24px;">
                                    <div style="width:60px; height:60px; background:rgba(46,191,165,0.1); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--primary);"><i class="ph ph-chart-line-up" style="font-size: 32px;"></i></div>
                                    <h3 style="font-size:18px; margin-bottom:10px;">Pantau Real-time</h3>
                                    <p style="font-size:14px; color:var(--text-muted);">Grafik pertumbuhan dengan kurva standar WHO yang mudah dipahami orang tua.</p>
                                </div>
                                <div class="card text-center" style="padding: 32px 24px;">
                                    <div style="width:60px; height:60px; background:rgba(77,150,255,0.1); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--info);"><i class="ph ph-brain" style="font-size: 32px;"></i></div>
                                    <h3 style="font-size:18px; margin-bottom:10px;">AI Nutritionist</h3>
                                    <p style="font-size:14px; color:var(--text-muted);">Rekomendasi menu makanan sehat yang dipersonalisasi.</p>
                                </div>
                                <div class="card text-center" style="padding: 32px 24px;">
                                    <div style="width:60px; height:60px; background:rgba(255,107,107,0.1); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:var(--secondary);"><i class="ph ph-first-aid" style="font-size: 32px;"></i></div>
                                    <h3 style="font-size:18px; margin-bottom:10px;">Deteksi Dini</h3>
                                    <p style="font-size:14px; color:var(--text-muted);">Peringatan otomatis jika pertumbuhan berpotensi stunting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            // --- VIEW: PARENT DASHBOARD ---
            renderDashboard: () => {
                const main = document.getElementById('app-content');
                
                let nutritionHtml = dummyNutrition.map(item => `
                    <div class="nutrition-item">
                        <div class="food-icon ${item.color}"><i class="ph ph-${item.icon}"></i></div>
                        <div><h4 style="font-size:14px; margin-bottom:2px;">${item.name}</h4><span style="font-size:11px; color:var(--text-muted);">${item.desc}</span></div>
                    </div>
                `).join('');

                let historyHtml = window.app.state.history.map(row => `
                    <tr><td>${row.date}</td><td>${row.age} bln</td><td>${row.height} / ${row.weight}</td><td><span class="status-badge ${row.status === 'Stunting' ? 'status-danger' : 'status-normal'}">${row.status}</span></td></tr>
                `).join('');

                let immuHtml = dummyImmunization.map(v => `
                    <div class="vaccine-card ${v.done ? 'done' : 'pending'}">
                        <i class="ph ph-syringe vaccine-icon"></i>
                        <div class="vaccine-name">${v.name}</div>
                        <div style="font-size:10px; color:var(--text-muted);">${v.age}</div>
                        <div class="check-circle">${v.done ? '<i class="ph ph-check"></i>' : ''}</div>
                    </div>
                `).join('');

                main.innerHTML = `
                    <div class="container" style="padding: 40px 20px;">
                        <div class="flex justify-between items-center mb-4">
                            <div><h2 style="font-size: 24px;">Dashboard Anak</h2><p style="color: var(--text-muted); font-size: 14px;">Monitoring Pertumbuhan & Gizi Balita</p></div>
                            <button class="btn btn-primary" onclick="window.app.refreshData()"><i class="ph ph-arrows-clockwise"></i> Update Data</button>
                        </div>
                        <div class="grid grid-2">
                            <div class="card">
                                <div class="card-header"><h3 class="card-title">Grafik Pertumbuhan (BB/TB)</h3><span style="font-size:12px; color:var(--primary); font-weight:600;">Standar WHO</span></div>
                                <div class="chart-container"><canvas id="growthChart"></canvas></div>
                                <div style="display:flex; gap:15px; margin-top:10px; font-size:12px; justify-content:center;">
                                    <div style="display:flex; align-items:center; gap:5px;"><span style="width:10px; height:10px; background:var(--secondary); border-radius:50%;"></span> Data Anak</div>
                                    <div style="display:flex; align-items:center; gap:5px;"><span style="width:10px; height:2px; background:#ddd;"></span> Median WHO</div>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header"><h3 class="card-title">AI Nutrisi</h3><button class="btn btn-outline" style="padding:6px 12px; font-size:12px;" onclick="window.app.generateMenu()"><i class="ph ph-arrows-clockwise"></i></button></div>
                                <div class="nutrition-list">${nutritionHtml}</div>
                            </div>
                            <div class="card">
                                <div class="card-header"><h3 class="card-title">Riwayat Kesehatan</h3><button class="btn btn-outline" style="padding:4px 8px;" onclick="window.print()"><i class="ph ph-printer"></i></button></div>
                                <div style="overflow-x:auto;"><table><thead><tr><th>Tgl</th><th>Usia</th><th>TB/BB</th><th>Status</th></tr></thead><tbody>${historyHtml}</tbody></table></div>
                            </div>
                            <div class="card">
                                <div class="card-header"><h3 class="card-title">Jadwal Imunisasi</h3><span style="font-size:12px; color:var(--text-muted);">Sesuai Kemenkes</span></div>
                                <div class="immunization-grid">${immuHtml}</div>
                            </div>
                        </div>
                    </div>
                `;
                setTimeout(() => window.app.drawParentChart(), 100);
            },

            // --- VIEW: EDUCATION (KEPMENKES & WHO) ---
            renderEducation: () => {
                const main = document.getElementById('app-content');
                
                let tipsHtml = dailyTips.map(tip => `
                    <div style="display:flex; align-items:center; gap:12px; padding:12px; background:white; border-radius:12px; border:1px solid var(--border);">
                        <div class="food-icon ${tip.color}" style="width:32px; height:32px; font-size:16px;"><i class="ph ph-${tip.icon}"></i></div>
                        <p style="font-size:13px; margin:0; color:var(--text-main);">${tip.text}</p>
                    </div>
                `).join('');

                let articlesHtml = window.app.state.articles.map(art => `
                    <article class="card edu-card">
                        <div class="edu-img-wrapper">
                            <img src="${art.img}" alt="${art.title}">
                            <span class="edu-category">${art.category}</span>
                            <div class="read-time"><i class="ph ph-clock"></i> ${art.readTime}</div>
                        </div>
                        <div class="edu-content">
                            <h3 style="font-size:18px; margin-bottom:8px;">${art.title}</h3>
                            <p style="font-size:14px; color:var(--text-muted); margin-bottom:12px; line-height:1.5;">${art.summary}</p>
                            <button class="btn btn-text" onclick="window.app.openArticle(${art.id}, event)">Baca Selengkapnya <i class="ph ph-arrow-right"></i></button>
                            <div class="edu-tags">
                                <span class="edu-tag">${art.source}</span>
                            </div>
                        </div>
                    </article>
                `).join('');

                main.innerHTML = `
                    <div class="container" style="padding: 40px 20px;">
                        <h2 class="text-center mb-4" style="font-size: 28px;">Pusat Edukasi Kesehatan</h2>
                        <p class="text-center" style="color:var(--text-muted); margin-bottom:40px;">Informasi valid berdasarkan standar WHO dan Kementrian Kesehatan RI.</p>
                        
                        <!-- Tips Section -->
                        <div class="card mb-4" style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white; border:none;">
                            <h3 style="margin-bottom:16px;"><i class="ph ph-lightbulb"></i> Tips Hari Ini</h3>
                            <div class="grid grid-3">${tipsHtml}</div>
                        </div>

                        <!-- Articles Grid -->
                        <div class="grid grid-3">${articlesHtml}</div>
                    </div>
                `;
            },

            // --- VIEW: ADMIN DASHBOARD ---
            renderAdmin: () => {
                const main = document.getElementById('app-content');
                const p = window.app.state.patients;
                const stats = { total: p.length, risk: p.filter(x => x.status === 'Risiko').length, stunting: p.filter(x => x.status === 'Stunting').length };
                
                let rows = '';
                p.forEach(pt => {
                    let badgeClass = pt.status === 'Normal' ? 'status-normal' : (pt.status === 'Stunting' ? 'status-danger' : 'status-warning');
                    rows += `
                        <tr>
                            <td><strong>${pt.name}</strong><br><span style="font-size:11px; color:var(--text-muted)">${pt.gender}, ${pt.age} bln</span></td>
                            <td>${pt.height} cm / ${pt.weight} kg</td>
                            <td><span class="status-badge ${badgeClass}">${pt.status}</span></td>
                            <td><button class="btn btn-outline btn-sm" onclick="window.app.openPatientDetail(${pt.id})"><i class="ph ph-eye"></i> Detail</button></td>
                        </tr>
                    `;
                });

                main.innerHTML = `
                    <div class="container" style="padding: 40px 20px;">
                        <div class="flex justify-between items-center mb-4">
                            <div><h2 style="font-size: 24px;">Dashboard Kader</h2><p style="color: var(--text-muted); font-size: 14px;">Posyandu Mawar, Desa Sehat</p></div>
                            <button class="btn btn-primary" onclick="window.print()"><i class="ph ph-printer"></i> Export Laporan</button>
                        </div>
                        <div class="grid grid-3 mb-4">
                            <div class="card" style="border-left: 4px solid var(--primary); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Total Balita</p><h3 style="font-size:24px;">${stats.total}</h3></div>
                            <div class="card" style="border-left: 4px solid var(--warning); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Risiko Stunting</p><h3 style="font-size:24px;">${stats.risk}</h3></div>
                            <div class="card" style="border-left: 4px solid var(--secondary); padding:16px;"><p style="color:var(--text-muted); font-size:12px;">Kasus Stunting</p><h3 style="font-size:24px;">${stats.stunting}</h3></div>
                        </div>
                        <div class="card">
                            <div class="card-header"><h3 class="card-title">Rekapan Data Pasien</h3><button class="btn btn-primary btn-sm" onclick="window.app.openAddPatientModal()"><i class="ph ph-plus"></i> Tambah</button></div>
                            <div class="table-responsive"><table><thead><tr><th>Nama & Usia</th><th>TB/BB</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows}</tbody></table></div>
                        </div>
                    </div>
                `;
            },

            // --- LOGIC: CHARTS ---
            drawParentChart: () => {
                const canvas = document.getElementById('growthChart');
                if(!canvas) return;
                const ctx = canvas.getContext('2d');
                const rect = canvas.parentNode.getBoundingClientRect();
                canvas.width = rect.width * 2; canvas.height = rect.height * 2;
                ctx.scale(2, 2); const w = rect.width; const h = rect.height; const padding = 30;
                ctx.clearRect(0,0, w, h);

                const maxAge = 24; const maxHeight = 90; const data = window.app.state.history;
                const getMedianY = (age) => h - padding - ((50 + (age * 2.5)) / maxHeight) * (h - padding*2);
                const getStuntingY = (age) => h - padding - ((45 + (age * 2.0)) / maxHeight) * (h - padding*2);
                const getX = (age) => padding + (age / maxAge) * (w - padding*2);

                // Zones
                ctx.beginPath(); ctx.moveTo(getX(0), getStuntingY(0));
                for(let i=0; i<=maxAge; i+=2) ctx.lineTo(getX(i), getStuntingY(i));
                ctx.lineTo(getX(maxAge), h-padding); ctx.lineTo(getX(0), h-padding);
                ctx.fillStyle = "rgba(255, 107, 107, 0.05)"; ctx.fill();

                // Stunting Line
                ctx.beginPath(); ctx.strokeStyle = "rgba(255, 107, 107, 0.4)"; ctx.setLineDash([5,5]);
                for(let i=0; i<=maxAge; i++) { const x = getX(i); const y = getStuntingY(i); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke(); ctx.setLineDash([]);

                // Median Line
                ctx.beginPath(); ctx.strokeStyle = "#E0E5F2";
                for(let i=0; i<=maxAge; i++) { const x = getX(i); const y = getMedianY(i); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); } ctx.stroke();

                // Data Line
                ctx.beginPath(); ctx.strokeStyle = "#FF6B6B"; ctx.lineWidth = 3;
                data.forEach((d, i) => { const x = getX(d.age); const y = h - padding - (d.height / maxHeight) * (h - padding*2); if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();

                // Dots
                data.forEach(d => { const x = getX(d.age); const y = h - padding - (d.height / maxHeight) * (h - padding*2);
                    ctx.beginPath(); ctx.fillStyle="#fff"; ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.fillStyle="#FF6B6B"; ctx.arc(x,y,4,0,Math.PI*2); ctx.fill();
                });
                
                ctx.fillStyle = "#A3AED0"; ctx.font = "10px Poppins"; ctx.fillText("Lahir", getX(0), h-10); ctx.fillText("24 Bln", getX(24), h-10);
            },

            drawPatientChart: (history) => {
                const canvas = document.getElementById('patientChart');
                if(!canvas) return;
                const ctx = canvas.getContext('2d'); const rect = canvas.parentNode.getBoundingClientRect();
                
                // Setup Canvas Scaling
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                
                // Clear canvas
                ctx.clearRect(0, 0, rect.width, rect.height);

                if (!history || history.length === 0) {
                    ctx.fillStyle = "#A3AED0";
                    ctx.font = "14px Poppins";
                    ctx.textAlign = "center";
                    ctx.fillText("Belum ada data riwayat.", rect.width / 2, rect.height / 2);
                    return;
                }

                const padding = 30; 
                const w = rect.width - padding*2; 
                const h = rect.height - padding*2;
                const maxAge = Math.max(...history.map(d => d.age)) + 1; 
                const maxHeight = Math.max(...history.map(d => d.h)) + 5;
                const maxWeight = Math.max(...history.map(d => d.w)) + 2;
                
                const getX = (age) => padding + (age / maxAge) * w; 
                const getY = (val, max) => (rect.height - padding) - (val / max) * h;
                
                // Axes
                ctx.beginPath();
                ctx.strokeStyle = '#E0E5F2';
                ctx.lineWidth = 1;
                ctx.moveTo(padding, padding);
                ctx.lineTo(padding, rect.height - padding);
                ctx.lineTo(rect.width - padding, rect.height - padding);
                ctx.stroke();

                // Height Line
                ctx.beginPath(); ctx.strokeStyle = '#2EBFA5'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
                history.forEach((d, i) => { const x = getX(d.age); const y = getY(d.h, maxHeight); if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();

                // Weight Line (Scaled x10 for visual comparison)
                ctx.beginPath(); ctx.strokeStyle = '#FFC107'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
                history.forEach((d, i) => { const x = getX(d.age); const y = getY(d.w * 10, maxHeight); if(i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();

                // Dots
                history.forEach(d => {
                    const x = getX(d.age);
                    // Height Dot
                    ctx.fillStyle = '#2EBFA5'; ctx.beginPath(); ctx.arc(x, getY(d.h, maxHeight), 4, 0, Math.PI*2); ctx.fill();
                    // Weight Dot
                    ctx.fillStyle = '#FFC107'; ctx.beginPath(); ctx.arc(x, getY(d.w * 10, maxHeight), 4, 0, Math.PI*2); ctx.fill();
                    
                    // Label Usia di bawah sumbu X
                    ctx.fillStyle = '#A3AED0';
                    ctx.font = "10px Poppins";
                    ctx.textAlign = "center";
                    ctx.fillText(d.age + " bln", x, rect.height - padding + 15);
                });

                // Legend
                const legendY = 20;
                ctx.textAlign = "left";
                
                // Legend Tinggi
                ctx.fillStyle = '#2EBFA5';
                ctx.beginPath(); ctx.arc(20, legendY, 4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#2B3674';
                ctx.fillText("Tinggi (cm)", 35, legendY + 4);

                // Legend Berat
                ctx.fillStyle = '#FFC107';
                ctx.beginPath(); ctx.arc(120, legendY, 4, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#2B3674';
                ctx.fillText("Berat (kg)", 135, legendY + 4);
            },

            // --- LOGIC: ADD PATIENT (ADMIN) ---
            openAddPatientModal: () => {
                document.getElementById('add-patient-modal').classList.add('active');
                document.getElementById('new-name').value = "";
                document.getElementById('new-dob').value = "";
                document.getElementById('new-height').value = "";
                document.getElementById('new-weight').value = "";
                document.getElementById('new-age-display').innerText = "";
            },
            updateNewAgeDisplay: () => {
                const dob = document.getElementById('new-dob').value;
                if(!dob) return;
                const months = window.app.calculateAgeMonths(dob);
                document.getElementById('new-age-display').innerText = `Usia Terhitung: ${months} Bulan`;
            },
            saveNewPatient: () => {
                const name = document.getElementById('new-name').value;
                const dob = document.getElementById('new-dob').value;
                const gender = document.getElementById('new-gender').value;
                const height = parseFloat(document.getElementById('new-height').value);
                const weight = parseFloat(document.getElementById('new-weight').value);

                if(!name || !dob || !height || !weight) {
                    window.app.showToast("Mohon lengkapi semua data.");
                    return;
                }

                const age = window.app.calculateAgeMonths(dob);
                
                const standardHeight = 75 + (age - 12) * 1.5;
                let status = 'Normal';
                if(height < standardHeight - 5) status = 'Stunting';
                else if(height < standardHeight - 2) status = 'Risiko';

                const newPatient = {
                    id: Date.now(),
                    name, dob, age, gender, height, weight, status,
                    notes: "Pasien Baru",
                    history: [{age: age, h: height, w: weight}]
                };

                window.app.state.patients.unshift(newPatient);
                window.app.showToast("Pasien berhasil ditambahkan!");
                document.getElementById('add-patient-modal').classList.remove('active');
                window.app.renderAdmin();
            },

            // --- LOGIC: PATIENT DETAIL & EDIT ---
            openPatientDetail: (id) => {
                const pt = window.app.state.patients.find(p => p.id === id); if(!pt) return;
                window.app.state.currentPatientId = id;
                document.getElementById('detail-name').innerText = pt.name; document.getElementById('detail-id').innerText = `ID: ${pt.id}`;
                document.getElementById('view-name').innerText = pt.name; document.getElementById('edit-name').value = pt.name;
                document.getElementById('view-dob').innerText = pt.dob + ` (${pt.age} Bulan)`;
                document.getElementById('view-height').innerText = pt.height; document.getElementById('edit-height').value = pt.height;
                document.getElementById('view-weight').innerText = pt.weight; document.getElementById('edit-weight').value = pt.weight;
                document.getElementById('view-notes').innerText = pt.notes || "-"; document.getElementById('edit-notes').value = pt.notes || "";
                
                const statusBadge = document.getElementById('view-status'); statusBadge.innerText = pt.status; 
                statusBadge.className = `status-badge ${pt.status === 'Normal' ? 'status-normal' : (pt.status === 'Stunting' ? 'status-danger' : 'status-warning')}`;

                document.getElementById('modal-content-area').classList.remove('edit-mode');
                document.getElementById('btn-save-patient').classList.add('hidden'); document.getElementById('btn-cancel-edit').classList.add('hidden');
                document.querySelector('#detail-actions .btn-outline').classList.remove('hidden');
                window.app.switchDetailTab('info'); window.app.drawPatientChart(pt.history);
                document.getElementById('patient-modal').classList.add('active');
            },
            
            switchDetailTab: (tabName) => {
                // Sembunyikan semua section
                document.querySelectorAll('.detail-section').forEach(el => el.classList.add('hidden'));
                // Tampilkan section yang dipilih
                document.getElementById(`tab-${tabName}`).classList.remove('hidden');
                
                // Update tombol tab active
                const btns = document.querySelectorAll('#modal-content-area .auth-tab');
                btns.forEach(b => b.classList.remove('active'));
                if(tabName === 'info') btns[0].classList.add('active'); 
                else if(tabName === 'chart') btns[1].classList.add('active');

                // LOGIKA PENTING: Redraw grafik saat tab chart dibuka
                if (tabName === 'chart') {
                    const pt = window.app.state.patients.find(p => p.id === window.app.state.currentPatientId);
                    if (pt && pt.history && pt.history.length > 0) {
                        // Delay sedikit agar DOM tab selesai render dulu (display:block)
                        setTimeout(() => {
                            window.app.drawPatientChart(pt.history);
                        }, 50);
                    }
                }
            },
            
            toggleEditMode: () => {
                const container = document.getElementById('modal-content-area'); container.classList.toggle('edit-mode');
                const isEditing = container.classList.contains('edit-mode');
                document.getElementById('btn-save-patient').classList.toggle('hidden', !isEditing);
                document.getElementById('btn-cancel-edit').classList.toggle('hidden', !isEditing);
                document.querySelector('#detail-actions .btn-outline').classList.toggle('hidden', isEditing);
            },
            savePatientChanges: () => {
                const id = window.app.state.currentPatientId; const ptIndex = window.app.state.patients.findIndex(p => p.id === id);
                if (ptIndex === -1) return;
                const newName = document.getElementById('edit-name').value; const newHeight = parseFloat(document.getElementById('edit-height').value); const newWeight = parseFloat(document.getElementById('edit-weight').value); const newNotes = document.getElementById('edit-notes').value;
                if(!newName || !newHeight || !newWeight) { alert("Data tidak boleh kosong"); return; }
                window.app.state.patients[ptIndex].name = newName; window.app.state.patients[ptIndex].height = newHeight; window.app.state.patients[ptIndex].weight = newWeight; window.app.state.patients[ptIndex].notes = newNotes;
                
                const age = window.app.state.patients[ptIndex].age; const stdHeight = 75 + (age - 12) * 1.5; let status = 'Normal';
                if(newHeight < stdHeight - 5) status = 'Stunting'; else if(newHeight < stdHeight - 2) status = 'Risiko';
                window.app.state.patients[ptIndex].status = status;
                window.app.state.patients[ptIndex].history.push({ age: age, h: newHeight, w: newWeight });

                window.app.showToast("Data pasien berhasil diperbarui"); window.app.toggleEditMode();
                window.app.openPatientDetail(id); window.app.renderAdmin();
            },

            // --- UTILS ---
            generateMenu: () => { window.app.showToast("Menu diperbarui!"); },
            refreshData: () => { window.app.showToast("Data disinkronisasi..."); },
            openArticle: (id, event) => {
                if(event) event.preventDefault();
                const art = window.app.state.articles.find(a => a.id === id); if(!art) return;
                document.getElementById('modal-img').src = art.img; document.getElementById('modal-tag').innerText = art.category;
                document.getElementById('modal-read-time').innerText = art.readTime;
                document.getElementById('modal-title').innerText = art.title; document.getElementById('modal-body').innerHTML = art.content;
                document.getElementById('article-modal').classList.add('active');
            },
            closeArticle: (event) => { if(event) event.stopPropagation(); document.getElementById('article-modal').classList.remove('active'); },
            togglePasswordVisibility: (event) => {
                event.preventDefault();
                const passInput = document.getElementById('login-pass');
                const toggleIcon = event.currentTarget.querySelector('i');
                if (passInput.type === 'password') {
                    passInput.type = 'text';
                    toggleIcon.className = 'ph ph-eye-slash';
                } else {
                    passInput.type = 'password';
                    toggleIcon.className = 'ph ph-eye';
                }
            },
            toggleTheme: (event) => {
                if(event) event.stopPropagation();
                window.app.state.theme = window.app.state.theme === 'light' ? 'dark' : 'light';
                document.body.setAttribute('data-theme', window.app.state.theme === 'dark' ? 'dark' : null);
            },
            toggleChat: (event) => { if(event) event.stopPropagation(); document.getElementById('chat-window').classList.toggle('open'); },
            sendChat: async (event) => {
                if(event) event.preventDefault();
                const inp = document.getElementById('chat-input');
                const txt = inp.value.trim();
                if(!txt) return;
                window.app.addChatMessage(txt, 'user');
                window.app.state.chatHistory.push({ role: 'user', content: txt });
                inp.value = '';
                window.app.addChatMessage('Sedang memproses...', 'bot');
                try {
                    const botReply = await window.app.fetchAiReply();
                    const chatBody = document.getElementById('chat-body');
                    const lastMsg = chatBody.querySelector('.chat-msg.chat-bot:last-child');
                    if (lastMsg && lastMsg.textContent === 'Sedang memproses...') {
                        lastMsg.textContent = botReply;
                    } else {
                        window.app.addChatMessage(botReply, 'bot');
                    }
                    window.app.state.chatHistory.push({ role: 'assistant', content: botReply });
                } catch (err) {
                    window.app.addChatMessage('Maaf, sistem AI sedang bermasalah. Coba lagi nanti.', 'bot');
                }
            },
            addChatMessage: (text, sender) => {
                const chatBody = document.getElementById('chat-body');
                chatBody.innerHTML += `<div class="chat-msg ${sender === 'user' ? 'chat-user' : 'chat-bot'}">${text}</div>`;
                chatBody.scrollTop = chatBody.scrollHeight;
            },
            fetchAiReply: async () => {
                const apiOrigin = window.location.protocol === 'file:' ? 'http://localhost:3000' : window.location.origin;
                const messages = window.app.state.chatHistory.slice(-12);
                try {
                    const response = await fetch(`${apiOrigin}/api/ai`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages })
                    });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => null);
                        throw new Error(errorData?.error || 'AI request failed');
                    }
                    const data = await response.json();
                    return data.reply || window.app.getAiReply(messages[messages.length - 1]?.content || '');
                } catch (error) {
                    console.error('AI fetch error:', error);
                    return window.app.getAiReply(messages[messages.length - 1]?.content || '');
                }
            },
            getAiReply: (text) => {
                const query = text.trim().toLowerCase();
                if (!query) return 'Silakan ketik pertanyaan Anda.';

                const responses = [
                    { keys: ['stunting'], answer: 'Stunting adalah kondisi ketika pertumbuhan anak terhambat akibat kekurangan gizi kronis. Pencegahan terbaik adalah ASI eksklusif 6 bulan, MPASI bergizi, dan pemantauan rutin di posyandu.' },
                    { keys: ['asi', 'breastfeed'], answer: 'ASI eksklusif selama 6 bulan pertama sangat penting. Setelah itu, berikan MPASI dengan gizi seimbang sambil tetap meneruskan ASI jika memungkinkan.' },
                    { keys: ['mpasi'], answer: 'MPASI dapat dimulai pada usia 6 bulan dengan tekstur dan porsi yang sesuai. Pastikan menu mengandung karbohidrat, protein, sayur, buah, dan lemak sehat.' },
                    { keys: ['imunisasi', 'vaksin'], answer: 'Imunisasi lengkap melindungi anak dari penyakit serius. Selalu periksa jadwal imunisasi di buku KIA dan jangan tunda vaksinasi wajib.' },
                    { keys: ['gizi', 'nutrisi'], answer: 'Gizi seimbang penting untuk pertumbuhan optimal. Perhatikan protein, zat besi, vitamin, dan lemak sehat dalam menu harian anak.' },
                    { keys: ['berat', 'tinggi', 'pertumbuhan'], answer: 'Pantau berat dan tinggi anak secara rutin. Jika ada kekhawatiran, konsultasikan dengan tenaga kesehatan terdekat untuk memeriksa status tumbuh kembang.' },
                    { keys: ['vitamin', 'kekurangan vitamin', 'kurang vitamin', 'vitamin apa', 'kekurangan vit'], answer: 'Kekurangan vitamin bisa menyebabkan gejala berbeda tergantung jenisnya. Umumnya, makan variasi sayur, buah, protein, dan susu membantu memenuhi kebutuhan vitamin dasar.' },
                    { keys: ['vitamin a', 'vit a', 'mata', 'rabun'], answer: 'Vitamin A penting untuk kesehatan mata dan sistem kekebalan. Sumber yang baik adalah wortel, bayam, ubi jalar, labu, dan sayur hijau gelap.' },
                    { keys: ['vitamin c', 'vit c', 'sistem kekebalan', 'jeruk', 'buah'], answer: 'Vitamin C membantu daya tahan tubuh dan penyembuhan. Sumber utama adalah jeruk, stroberi, kiwi, paprika merah, dan brokoli.' },
                    { keys: ['vitamin d', 'vit d', 'tulang', 'kalsium'], answer: 'Vitamin D penting untuk penyerapan kalsium dan tulang yang kuat. Sumber alami termasuk ikan berlemak, telur, susu diperkaya, dan sinar matahari pagi.' },
                    { keys: ['vitamin b', 'vit b', 'b1', 'b2', 'b3', 'b6', 'b12', 'asam folat'], answer: 'Vitamin B membantu energi dan fungsi saraf. Makanan sumbernya adalah daging tanpa lemak, telur, susu, kacang-kacangan, dan sayur hijau.' },
                    { keys: ['zat besi', 'iron', 'anemia', 'kekurangan besi'], answer: 'Zat besi penting untuk darah dan energi. Konsumsi daging merah, hati, kacang kedelai, bayam, dan kacang-kacangan.' },
                    { keys: ['kalsium', 'calcium', 'tulang', 'gigi'], answer: 'Kalsium penting untuk tulang dan gigi kuat. Sumbernya termasuk susu, yogurt, keju, tahu, dan sayuran hijau.' },
                    { keys: ['sakit', 'demam', 'batuk', 'pilek'], answer: 'Jika anak demam atau batuk, istirahatkan anak, berikan cairan cukup, dan periksa ke tenaga kesehatan bila gejala bertahan atau semakin parah.' },
                    { keys: ['halo', 'hai', 'hi', 'selamat pagi', 'selamat siang', 'selamat malam'], answer: 'Halo! Saya GlucoBot AI, siap membantu pertanyaan Anda seputar kesehatan dan nutrisi balita.' },
                    { keys: ['terima kasih', 'makasih', 'thanks'], answer: 'Sama-sama! Jika perlu, Anda bisa menanyakan lagi apa saja tentang kesehatan anak.' }
                ];

                for (const item of responses) {
                    if (item.keys.some(key => query.includes(key))) {
                        return item.answer;
                    }
                }

                const questionType = query.match(/\b(apakah|apa|mengapa|kenapa|bagaimana|kapan|di mana|dimana|siapa|berapa|adakah|tolong|bantu|buat)\b/);
                if (questionType) {
                    return `Saya akan coba jawab: ${text}. Saya siap membantu dengan informasi umum, saran praktis, atau jawaban lain sesuai permintaan Anda.`;
                }

                return `Saya menjawab pertanyaan Anda: "${text}". Saya akan memberikan respons yang informatif dan berguna untuk topik apa pun yang Anda ajukan.`;
            },
            checkTheme: () => {},
            showToast: (msg) => {
                const t = document.getElementById('toast'); document.getElementById('toast-msg').innerText = msg; t.classList.add('show');
                setTimeout(() => t.classList.remove('show'), 3000);
            }
        };

        document.addEventListener('DOMContentLoaded', window.app.init);
