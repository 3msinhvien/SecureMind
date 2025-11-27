require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB đã kết nối'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Data mẫu - Users
const sampleUsers = [
    {
        username: 'admin',
        email: 'admin@cybersec.edu',
        password: 'admin123',
        fullName: 'Quản trị viên',
        role: 'admin'
    },
    {
        username: 'nguyenvana',
        email: 'nguyenvana@student.edu',
        password: 'student123',
        fullName: 'Nguyễn Văn A',
        studentId: 'SV001'
    },
    {
        username: 'tranthib',
        email: 'tranthib@student.edu',
        password: 'student123',
        fullName: 'Trần Thị B',
        studentId: 'SV002'
    },
    {
        username: 'lequangc',
        email: 'lequangc@student.edu',
        password: 'student123',
        fullName: 'Lê Quang C',
        studentId: 'SV003'
    },
    {
        username: 'phamminhtd',
        email: 'phamminhtd@student.edu',
        password: 'student123',
        fullName: 'Phạm Minh D',
        studentId: 'SV004'
    }
];

// Data mẫu - Quizzes Trắc nghiệm
const multipleChoiceQuizzes = [
    {
        title: 'Kiến thức cơ bản về Mật mã học',
        description: 'Bài kiểm tra về các khái niệm cơ bản trong mật mã học, mã hóa đối xứng và bất đối xứng',
        type: 'multiple-choice',
        difficulty: 'easy',
        timeLimit: 20,
        passingScore: 70,
        category: 'cryptography',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Thuật toán mã hóa nào sau đây là mã hóa đối xứng?',
                questionType: 'single-choice',
                options: ['AES', 'RSA', 'ECC', 'DSA'],
                correctAnswer: 'AES',
                points: 10,
                explanation: 'AES (Advanced Encryption Standard) là thuật toán mã hóa đối xứng, trong khi RSA, ECC, DSA là các thuật toán bất đối xứng.'
            },
            {
                questionText: 'Trong mã hóa bất đối xứng, khóa nào được sử dụng để mã hóa dữ liệu?',
                questionType: 'single-choice',
                options: ['Khóa công khai', 'Khóa riêng tư', 'Cả hai', 'Không cần khóa'],
                correctAnswer: 'Khóa công khai',
                points: 10,
                explanation: 'Trong mã hóa bất đối xứng, khóa công khai dùng để mã hóa, khóa riêng tư dùng để giải mã.'
            },
            {
                questionText: 'Hash function nào được coi là an toàn nhất hiện nay?',
                questionType: 'single-choice',
                options: ['MD5', 'SHA-1', 'SHA-256', 'CRC32'],
                correctAnswer: 'SHA-256',
                points: 10,
                explanation: 'SHA-256 là hàm hash an toàn nhất trong các lựa chọn. MD5 và SHA-1 đã bị phá vỡ.'
            },
            {
                questionText: 'Chọn các đặc điểm của hàm hash tốt:',
                questionType: 'multiple-choice',
                options: [
                    'Khó tìm collision',
                    'Một chiều (không thể reverse)',
                    'Output có độ dài cố định',
                    'Nhanh chóng tính toán'
                ],
                correctAnswer: ['Khó tìm collision', 'Một chiều (không thể reverse)', 'Output có độ dài cố định', 'Nhanh chóng tính toán'],
                points: 20,
                explanation: 'Tất cả các đặc điểm trên đều là yêu cầu của một hàm hash tốt.'
            },
            {
                questionText: 'Salt trong password hashing có tác dụng gì?',
                questionType: 'single-choice',
                options: [
                    'Tăng tốc độ hash',
                    'Chống rainbow table attack',
                    'Giảm kích thước hash',
                    'Không có tác dụng'
                ],
                correctAnswer: 'Chống rainbow table attack',
                points: 10,
                explanation: 'Salt là chuỗi ngẫu nhiên được thêm vào password trước khi hash, giúp chống rainbow table attack.'
            },
            {
                questionText: 'Digital signature được tạo bằng cách nào?',
                questionType: 'single-choice',
                options: [
                    'Hash message và mã hóa bằng khóa công khai',
                    'Hash message và mã hóa bằng khóa riêng tư',
                    'Chỉ hash message',
                    'Chỉ mã hóa message'
                ],
                correctAnswer: 'Hash message và mã hóa bằng khóa riêng tư',
                points: 10,
                explanation: 'Digital signature được tạo bằng cách hash message rồi mã hóa hash đó bằng khóa riêng tư.'
            },
            {
                questionText: 'Block cipher mode nào cho phép mã hóa song song?',
                questionType: 'single-choice',
                options: ['CBC', 'ECB', 'CFB', 'OFB'],
                correctAnswer: 'ECB',
                points: 10,
                explanation: 'ECB (Electronic Codebook) cho phép mã hóa các block độc lập, có thể song song hóa.'
            },
            {
                questionText: 'Perfect Forward Secrecy đảm bảo điều gì?',
                questionType: 'single-choice',
                options: [
                    'Khóa session không bị compromise nếu khóa long-term bị lộ',
                    'Mã hóa nhanh hơn',
                    'Khóa dài hơn',
                    'Không thể bị tấn công'
                ],
                correctAnswer: 'Khóa session không bị compromise nếu khóa long-term bị lộ',
                points: 10,
                explanation: 'Perfect Forward Secrecy đảm bảo rằng việc lộ khóa private key không ảnh hưởng đến các session trước đó.'
            },
            {
                questionText: 'Diffie-Hellman được sử dụng để làm gì?',
                questionType: 'single-choice',
                options: [
                    'Mã hóa dữ liệu',
                    'Trao đổi khóa',
                    'Hash password',
                    'Digital signature'
                ],
                correctAnswer: 'Trao đổi khóa',
                points: 10,
                explanation: 'Diffie-Hellman là giao thức trao đổi khóa an toàn qua kênh không bảo mật.'
            },
            {
                questionText: 'Độ dài khóa RSA được khuyến nghị hiện nay là bao nhiêu?',
                questionType: 'single-choice',
                options: ['512 bits', '1024 bits', '2048 bits', '4096 bits'],
                correctAnswer: '2048 bits',
                points: 10,
                explanation: 'Độ dài khóa RSA được khuyến nghị hiện nay là ít nhất 2048 bits để đảm bảo an toàn.'
            }
        ]
    },
    {
        title: 'An toàn mạng và Firewall',
        description: 'Kiểm tra kiến thức về an toàn mạng, firewall, IDS/IPS và các giao thức bảo mật',
        type: 'multiple-choice',
        difficulty: 'medium',
        timeLimit: 25,
        passingScore: 70,
        category: 'network-security',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Firewall hoạt động ở layer nào của mô hình OSI?',
                questionType: 'single-choice',
                options: ['Layer 2', 'Layer 3 và 4', 'Layer 7', 'Tất cả các layer'],
                correctAnswer: 'Tất cả các layer',
                points: 10,
                explanation: 'Firewall hiện đại có thể hoạt động ở nhiều layer khác nhau: packet filtering (L3-4), application firewall (L7).'
            },
            {
                questionText: 'IDS và IPS khác nhau như thế nào?',
                questionType: 'single-choice',
                options: [
                    'IDS chỉ phát hiện, IPS có thể chặn',
                    'IPS chỉ phát hiện, IDS có thể chặn',
                    'Không có sự khác biệt',
                    'IDS nhanh hơn IPS'
                ],
                correctAnswer: 'IDS chỉ phát hiện, IPS có thể chặn',
                points: 10,
                explanation: 'IDS (Intrusion Detection System) chỉ phát hiện và cảnh báo, IPS (Intrusion Prevention System) có thể chặn tấn công.'
            },
            {
                questionText: 'VPN sử dụng giao thức nào để mã hóa?',
                questionType: 'multiple-choice',
                options: ['IPSec', 'SSL/TLS', 'PPTP', 'L2TP'],
                correctAnswer: ['IPSec', 'SSL/TLS'],
                points: 20,
                explanation: 'IPSec và SSL/TLS là hai giao thức mã hóa chính được sử dụng trong VPN hiện đại.'
            },
            {
                questionText: 'DMZ (Demilitarized Zone) dùng để làm gì?',
                questionType: 'single-choice',
                options: [
                    'Tách biệt mạng công cộng và mạng nội bộ',
                    'Tăng tốc độ mạng',
                    'Backup dữ liệu',
                    'Quản lý user'
                ],
                correctAnswer: 'Tách biệt mạng công cộng và mạng nội bộ',
                points: 10,
                explanation: 'DMZ là vùng mạng trung gian giữa mạng công cộng (Internet) và mạng nội bộ, chứa các server công khai.'
            },
            {
                questionText: 'Tấn công DDoS có thể được giảm thiểu bằng cách nào?',
                questionType: 'multiple-choice',
                options: [
                    'Rate limiting',
                    'Load balancing',
                    'CDN',
                    'Firewall rules'
                ],
                correctAnswer: ['Rate limiting', 'Load balancing', 'CDN', 'Firewall rules'],
                points: 20,
                explanation: 'Tất cả các phương pháp trên đều có thể giúp giảm thiểu tác động của tấn công DDoS.'
            },
            {
                questionText: 'Port scanning được sử dụng để làm gì?',
                questionType: 'single-choice',
                options: [
                    'Tìm các port đang mở trên hệ thống',
                    'Mã hóa dữ liệu',
                    'Backup hệ thống',
                    'Tăng băng thông'
                ],
                correctAnswer: 'Tìm các port đang mở trên hệ thống',
                points: 10,
                explanation: 'Port scanning là kỹ thuật quét để tìm các port đang mở và dịch vụ đang chạy trên hệ thống.'
            },
            {
                questionText: 'Giao thức nào được sử dụng để truyền email an toàn?',
                questionType: 'single-choice',
                options: ['SMTP', 'SMTPS', 'FTP', 'HTTP'],
                correctAnswer: 'SMTPS',
                points: 10,
                explanation: 'SMTPS (SMTP over SSL/TLS) là phiên bản bảo mật của SMTP, mã hóa email khi truyền.'
            },
            {
                questionText: 'Honey pot là gì?',
                questionType: 'single-choice',
                options: [
                    'Hệ thống bẫy để thu thập thông tin về attacker',
                    'Loại firewall',
                    'Công cụ mã hóa',
                    'Phần mềm antivirus'
                ],
                correctAnswer: 'Hệ thống bẫy để thu thập thông tin về attacker',
                points: 10,
                explanation: 'Honey pot là hệ thống giả mạo được thiết lập để thu hút và nghiên cứu hành vi của attacker.'
            },
            {
                questionText: 'NAT có tác dụng bảo mật nào?',
                questionType: 'single-choice',
                options: [
                    'Ẩn IP nội bộ',
                    'Mã hóa traffic',
                    'Chống virus',
                    'Tăng tốc độ'
                ],
                correctAnswer: 'Ẩn IP nội bộ',
                points: 10,
                explanation: 'NAT (Network Address Translation) giúp ẩn địa chỉ IP nội bộ, tăng cường bảo mật cho mạng.'
            },
            {
                questionText: 'HTTPS sử dụng port mặc định nào?',
                questionType: 'single-choice',
                options: ['80', '443', '8080', '22'],
                correctAnswer: '443',
                points: 10,
                explanation: 'HTTPS sử dụng port 443 làm port mặc định (HTTP sử dụng port 80).'
            }
        ]
    },
    {
        title: 'Web Security và OWASP Top 10',
        description: 'Bài kiểm tra về các lỗ hổng bảo mật web phổ biến theo OWASP Top 10',
        type: 'multiple-choice',
        difficulty: 'medium',
        timeLimit: 30,
        passingScore: 70,
        category: 'web-security',
        totalPoints: 100,
        questions: [
            {
                questionText: 'SQL Injection xảy ra khi nào?',
                questionType: 'single-choice',
                options: [
                    'Input không được validate và sanitize',
                    'Database không có password',
                    'Server bị chậm',
                    'Không có backup'
                ],
                correctAnswer: 'Input không được validate và sanitize',
                points: 10,
                explanation: 'SQL Injection xảy ra khi ứng dụng không kiểm tra và làm sạch input từ user trước khi đưa vào SQL query.'
            },
            {
                questionText: 'XSS (Cross-Site Scripting) có mấy loại chính?',
                questionType: 'single-choice',
                options: ['1', '2', '3', '4'],
                correctAnswer: '3',
                points: 10,
                explanation: 'XSS có 3 loại chính: Reflected XSS, Stored XSS, và DOM-based XSS.'
            },
            {
                questionText: 'Cách phòng chống SQL Injection hiệu quả nhất là gì?',
                questionType: 'single-choice',
                options: [
                    'Sử dụng Prepared Statements',
                    'Mã hóa database',
                    'Tắt error messages',
                    'Dùng firewall'
                ],
                correctAnswer: 'Sử dụng Prepared Statements',
                points: 10,
                explanation: 'Prepared Statements (Parameterized Queries) là cách hiệu quả nhất để phòng chống SQL Injection.'
            },
            {
                questionText: 'CSRF (Cross-Site Request Forgery) có thể phòng chống bằng:',
                questionType: 'multiple-choice',
                options: [
                    'CSRF Token',
                    'SameSite Cookie attribute',
                    'Kiểm tra Referer header',
                    'Captcha'
                ],
                correctAnswer: ['CSRF Token', 'SameSite Cookie attribute', 'Kiểm tra Referer header'],
                points: 20,
                explanation: 'CSRF Token là phương pháp phổ biến nhất, kết hợp với SameSite cookie và kiểm tra Referer header.'
            },
            {
                questionText: 'Session Hijacking là gì?',
                questionType: 'single-choice',
                options: [
                    'Đánh cắp session ID của user',
                    'Tấn công DDoS',
                    'SQL Injection',
                    'Phishing'
                ],
                correctAnswer: 'Đánh cắp session ID của user',
                points: 10,
                explanation: 'Session Hijacking là kỹ thuật đánh cắp session ID để mạo danh user đã đăng nhập.'
            },
            {
                questionText: 'Content Security Policy (CSP) giúp phòng chống loại tấn công nào?',
                questionType: 'single-choice',
                options: ['XSS', 'SQL Injection', 'CSRF', 'DDoS'],
                correctAnswer: 'XSS',
                points: 10,
                explanation: 'CSP là cơ chế bảo mật giúp phát hiện và giảm thiểu XSS attacks bằng cách kiểm soát nguồn tài nguyên.'
            },
            {
                questionText: 'HTTP Security Headers nào giúp chống clickjacking?',
                questionType: 'single-choice',
                options: [
                    'X-Frame-Options',
                    'X-Content-Type-Options',
                    'X-XSS-Protection',
                    'Strict-Transport-Security'
                ],
                correctAnswer: 'X-Frame-Options',
                points: 10,
                explanation: 'X-Frame-Options header giúp chống clickjacking bằng cách kiểm soát việc embed trang trong iframe.'
            },
            {
                questionText: 'HTTPS có thể bị tấn công Man-in-the-Middle không?',
                questionType: 'single-choice',
                options: [
                    'Có, nếu certificate không được validate đúng',
                    'Không, hoàn toàn an toàn',
                    'Chỉ trên HTTP',
                    'Không liên quan'
                ],
                correctAnswer: 'Có, nếu certificate không được validate đúng',
                points: 10,
                explanation: 'HTTPS có thể bị MITM nếu certificate bị giả mạo và client không validate đúng cách.'
            },
            {
                questionText: 'Password nên được lưu trữ như thế nào?',
                questionType: 'single-choice',
                options: [
                    'Hash với salt',
                    'Plain text',
                    'Mã hóa đối xứng',
                    'Chỉ hash không cần salt'
                ],
                correctAnswer: 'Hash với salt',
                points: 10,
                explanation: 'Password nên được hash với salt để chống rainbow table attack và tăng tính bảo mật.'
            },
            {
                questionText: 'OWASP Top 10 được cập nhật bao lâu một lần?',
                questionType: 'single-choice',
                options: ['Hàng năm', 'Mỗi 2 năm', 'Mỗi 3-4 năm', 'Mỗi 5 năm'],
                correctAnswer: 'Mỗi 3-4 năm',
                points: 10,
                explanation: 'OWASP Top 10 thường được cập nhật mỗi 3-4 năm để phản ánh các mối đe dọa bảo mật web mới nhất.'
            }
        ]
    },
    {
        title: 'Malware và Phân tích mã độc',
        description: 'Kiểm tra kiến thức về các loại malware, kỹ thuật phân tích và phòng chống',
        type: 'multiple-choice',
        difficulty: 'hard',
        timeLimit: 30,
        passingScore: 70,
        category: 'malware',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Ransomware hoạt động theo cơ chế nào?',
                questionType: 'single-choice',
                options: [
                    'Mã hóa dữ liệu và yêu cầu tiền chuộc',
                    'Đánh cắp thông tin',
                    'Tạo botnet',
                    'Phá hoại hệ thống'
                ],
                correctAnswer: 'Mã hóa dữ liệu và yêu cầu tiền chuộc',
                points: 10,
                explanation: 'Ransomware mã hóa dữ liệu của nạn nhân và yêu cầu tiền chuộc để cung cấp khóa giải mã.'
            },
            {
                questionText: 'Rootkit là gì?',
                questionType: 'single-choice',
                options: [
                    'Malware ẩn mình và cung cấp quyền truy cập cho attacker',
                    'Loại virus',
                    'Công cụ phân tích',
                    'Firewall'
                ],
                correctAnswer: 'Malware ẩn mình và cung cấp quyền truy cập cho attacker',
                points: 10,
                explanation: 'Rootkit là malware ẩn sự tồn tại của nó và cung cấp quyền truy cập privileged cho attacker.'
            },
            {
                questionText: 'Trojan khác virus ở điểm nào?',
                questionType: 'single-choice',
                options: [
                    'Trojan không tự nhân bản',
                    'Virus không tự nhân bản',
                    'Không có sự khác biệt',
                    'Trojan chỉ hoạt động trên mobile'
                ],
                correctAnswer: 'Trojan không tự nhân bản',
                points: 10,
                explanation: 'Trojan giả dạng phần mềm hợp pháp nhưng không tự nhân bản, trong khi virus có khả năng tự nhân bản.'
            },
            {
                questionText: 'Các kỹ thuật phân tích malware bao gồm:',
                questionType: 'multiple-choice',
                options: [
                    'Static Analysis',
                    'Dynamic Analysis',
                    'Behavioral Analysis',
                    'Code Review'
                ],
                correctAnswer: ['Static Analysis', 'Dynamic Analysis', 'Behavioral Analysis'],
                points: 20,
                explanation: 'Phân tích malware bao gồm Static (không chạy), Dynamic (chạy trong sandbox), và Behavioral analysis.'
            },
            {
                questionText: 'Sandbox trong phân tích malware dùng để làm gì?',
                questionType: 'single-choice',
                options: [
                    'Chạy malware trong môi trường cô lập',
                    'Xóa malware',
                    'Mã hóa malware',
                    'Backup hệ thống'
                ],
                correctAnswer: 'Chạy malware trong môi trường cô lập',
                points: 10,
                explanation: 'Sandbox là môi trường ảo cô lập để chạy và quan sát hành vi của malware an toàn.'
            },
            {
                questionText: 'Zero-day exploit là gì?',
                questionType: 'single-choice',
                options: [
                    'Lỗ hổng chưa được vá',
                    'Malware cũ',
                    'Công cụ bảo mật',
                    'Kỹ thuật mã hóa'
                ],
                correctAnswer: 'Lỗ hổng chưa được vá',
                points: 10,
                explanation: 'Zero-day exploit là lỗ hổng bảo mật chưa được phát hiện hoặc chưa có bản vá.'
            },
            {
                questionText: 'APT (Advanced Persistent Threat) có đặc điểm gì?',
                questionType: 'multiple-choice',
                options: [
                    'Tấn công có mục tiêu cụ thể',
                    'Kéo dài thời gian',
                    'Sử dụng kỹ thuật tinh vi',
                    'Thường do tổ chức thực hiện'
                ],
                correctAnswer: ['Tấn công có mục tiêu cụ thể', 'Kéo dài thời gian', 'Sử dụng kỹ thuật tinh vi', 'Thường do tổ chức thực hiện'],
                points: 20,
                explanation: 'APT là tấn công tinh vi, có mục tiêu, kéo dài, thường do các tổ chức có nguồn lực lớn thực hiện.'
            },
            {
                questionText: 'Polymorphic malware là gì?',
                questionType: 'single-choice',
                options: [
                    'Malware thay đổi code để tránh detection',
                    'Malware không thể detect',
                    'Malware chỉ hoạt động một lần',
                    'Malware an toàn'
                ],
                correctAnswer: 'Malware thay đổi code để tránh detection',
                points: 10,
                explanation: 'Polymorphic malware tự thay đổi code (nhưng giữ nguyên functionality) để tránh signature-based detection.'
            },
            {
                questionText: 'Phương pháp nào hiệu quả nhất để phòng chống ransomware?',
                questionType: 'single-choice',
                options: [
                    'Backup dữ liệu thường xuyên',
                    'Cài antivirus',
                    'Dùng firewall',
                    'Tắt máy'
                ],
                correctAnswer: 'Backup dữ liệu thường xuyên',
                points: 10,
                explanation: 'Backup dữ liệu thường xuyên và offline là cách hiệu quả nhất để phòng chống ransomware.'
            },
            {
                questionText: 'Indicator of Compromise (IoC) là gì?',
                questionType: 'single-choice',
                options: [
                    'Dấu hiệu cho thấy hệ thống bị xâm nhập',
                    'Loại malware',
                    'Công cụ bảo mật',
                    'Giao thức mạng'
                ],
                correctAnswer: 'Dấu hiệu cho thấy hệ thống bị xâm nhập',
                points: 10,
                explanation: 'IoC là các artifacts hoặc dấu hiệu forensic cho thấy hệ thống có thể đã bị xâm nhập.'
            }
        ]
    },
    {
        title: 'Penetration Testing và Ethical Hacking',
        description: 'Kiểm tra kiến thức về các kỹ thuật và phương pháp penetration testing',
        type: 'multiple-choice',
        difficulty: 'hard',
        timeLimit: 35,
        passingScore: 70,
        category: 'general',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Penetration Testing có mấy giai đoạn chính?',
                questionType: 'single-choice',
                options: ['3', '5', '7', '10'],
                correctAnswer: '5',
                points: 10,
                explanation: 'Pentest có 5 giai đoạn: Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks.'
            },
            {
                questionText: 'Reconnaissance trong pentest là gì?',
                questionType: 'single-choice',
                options: [
                    'Thu thập thông tin về target',
                    'Tấn công hệ thống',
                    'Xóa log',
                    'Backup dữ liệu'
                ],
                correctAnswer: 'Thu thập thông tin về target',
                points: 10,
                explanation: 'Reconnaissance là giai đoạn thu thập thông tin về target để chuẩn bị cho tấn công.'
            },
            {
                questionText: 'White Box Testing là gì?',
                questionType: 'single-choice',
                options: [
                    'Tester có đầy đủ thông tin về hệ thống',
                    'Tester không biết gì về hệ thống',
                    'Tester biết một phần thông tin',
                    'Không test'
                ],
                correctAnswer: 'Tester có đầy đủ thông tin về hệ thống',
                points: 10,
                explanation: 'White Box Testing: tester có full knowledge về hệ thống (code, architecture, credentials).'
            },
            {
                questionText: 'Metasploit là gì?',
                questionType: 'single-choice',
                options: [
                    'Framework cho penetration testing',
                    'Antivirus',
                    'Firewall',
                    'Database'
                ],
                correctAnswer: 'Framework cho penetration testing',
                points: 10,
                explanation: 'Metasploit là framework phổ biến nhất cho penetration testing và exploit development.'
            },
            {
                questionText: 'Các loại Social Engineering bao gồm:',
                questionType: 'multiple-choice',
                options: [
                    'Phishing',
                    'Pretexting',
                    'Baiting',
                    'Tailgating'
                ],
                correctAnswer: ['Phishing', 'Pretexting', 'Baiting', 'Tailgating'],
                points: 20,
                explanation: 'Social Engineering có nhiều hình thức: Phishing, Pretexting, Baiting, Tailgating, Quid pro quo.'
            },
            {
                questionText: 'Privilege Escalation là gì?',
                questionType: 'single-choice',
                options: [
                    'Nâng quyền từ user thường lên admin',
                    'Tạo user mới',
                    'Xóa user',
                    'Đổi password'
                ],
                correctAnswer: 'Nâng quyền từ user thường lên admin',
                points: 10,
                explanation: 'Privilege Escalation là kỹ thuật nâng quyền truy cập từ user thường lên privileged user.'
            },
            {
                questionText: 'Buffer Overflow có thể dẫn đến:',
                questionType: 'multiple-choice',
                options: [
                    'Remote Code Execution',
                    'Denial of Service',
                    'Information Disclosure',
                    'Privilege Escalation'
                ],
                correctAnswer: ['Remote Code Execution', 'Denial of Service', 'Privilege Escalation'],
                points: 20,
                explanation: 'Buffer Overflow có thể dẫn đến RCE, DoS, và Privilege Escalation tùy thuộc vào cách khai thác.'
            },
            {
                questionText: 'OWASP ZAP là gì?',
                questionType: 'single-choice',
                options: [
                    'Web application security scanner',
                    'Network scanner',
                    'Password cracker',
                    'Firewall'
                ],
                correctAnswer: 'Web application security scanner',
                points: 10,
                explanation: 'OWASP ZAP là công cụ open-source để tìm lỗ hổng bảo mật trong web applications.'
            },
            {
                questionText: 'Brute Force Attack có thể phòng chống bằng:',
                questionType: 'multiple-choice',
                options: [
                    'Rate limiting',
                    'Account lockout',
                    'Captcha',
                    '2FA'
                ],
                correctAnswer: ['Rate limiting', 'Account lockout', 'Captcha', '2FA'],
                points: 10,
                explanation: 'Tất cả các phương pháp trên đều hiệu quả trong việc phòng chống brute force attack.'
            },
            {
                questionText: 'Red Team và Blue Team khác nhau như thế nào?',
                questionType: 'single-choice',
                options: [
                    'Red Team tấn công, Blue Team phòng thủ',
                    'Blue Team tấn công, Red Team phòng thủ',
                    'Không có sự khác biệt',
                    'Chỉ là tên gọi khác nhau'
                ],
                correctAnswer: 'Red Team tấn công, Blue Team phòng thủ',
                points: 10,
                explanation: 'Red Team mô phỏng attacker để test security, Blue Team phòng thủ và phát hiện tấn công.'
            }
        ]
    },
    {
        title: 'Security Compliance và Standards',
        description: 'Kiểm tra kiến thức về các tiêu chuẩn bảo mật, compliance và best practices',
        type: 'multiple-choice',
        difficulty: 'medium',
        timeLimit: 25,
        passingScore: 70,
        category: 'general',
        totalPoints: 100,
        questions: [
            {
                questionText: 'ISO 27001 là gì?',
                questionType: 'single-choice',
                options: [
                    'Tiêu chuẩn quản lý an ninh thông tin',
                    'Giao thức mạng',
                    'Thuật toán mã hóa',
                    'Phần mềm bảo mật'
                ],
                correctAnswer: 'Tiêu chuẩn quản lý an ninh thông tin',
                points: 10,
                explanation: 'ISO 27001 là tiêu chuẩn quốc tế về hệ thống quản lý an ninh thông tin (ISMS).'
            },
            {
                questionText: 'CIA Triad trong security bao gồm:',
                questionType: 'multiple-choice',
                options: [
                    'Confidentiality',
                    'Integrity',
                    'Availability',
                    'Authentication'
                ],
                correctAnswer: ['Confidentiality', 'Integrity', 'Availability'],
                points: 20,
                explanation: 'CIA Triad gồm: Confidentiality (bí mật), Integrity (toàn vẹn), Availability (sẵn sàng).'
            },
            {
                questionText: 'GDPR áp dụng cho:',
                questionType: 'single-choice',
                options: [
                    'Dữ liệu cá nhân của công dân EU',
                    'Chỉ các công ty EU',
                    'Chỉ dữ liệu tài chính',
                    'Không còn hiệu lực'
                ],
                correctAnswer: 'Dữ liệu cá nhân của công dân EU',
                points: 10,
                explanation: 'GDPR (General Data Protection Regulation) bảo vệ dữ liệu cá nhân của công dân EU, áp dụng cho mọi tổ chức xử lý dữ liệu này.'
            },
            {
                questionText: 'PCI DSS liên quan đến:',
                questionType: 'single-choice',
                options: [
                    'Bảo mật thông tin thẻ thanh toán',
                    'Bảo mật email',
                    'Bảo mật mạng',
                    'Bảo mật mobile'
                ],
                correctAnswer: 'Bảo mật thông tin thẻ thanh toán',
                points: 10,
                explanation: 'PCI DSS (Payment Card Industry Data Security Standard) là tiêu chuẩn bảo mật cho xử lý thẻ thanh toán.'
            },
            {
                questionText: 'Principle of Least Privilege có nghĩa là:',
                questionType: 'single-choice',
                options: [
                    'User chỉ có quyền tối thiểu cần thiết',
                    'User có full access',
                    'Không có user nào có quyền',
                    'Tất cả user đều bình đẳng'
                ],
                correctAnswer: 'User chỉ có quyền tối thiểu cần thiết',
                points: 10,
                explanation: 'Principle of Least Privilege: mỗi user/process chỉ có quyền tối thiểu cần thiết để hoàn thành công việc.'
            },
            {
                questionText: 'Defense in Depth strategy là gì?',
                questionType: 'single-choice',
                options: [
                    'Sử dụng nhiều lớp bảo vệ',
                    'Chỉ dùng một firewall mạnh',
                    'Không cần bảo mật',
                    'Chỉ bảo vệ perimeter'
                ],
                correctAnswer: 'Sử dụng nhiều lớp bảo vệ',
                points: 10,
                explanation: 'Defense in Depth là chiến lược sử dụng nhiều lớp bảo vệ độc lập để tăng cường security.'
            },
            {
                questionText: 'Incident Response Plan bao gồm các giai đoạn:',
                questionType: 'multiple-choice',
                options: [
                    'Preparation',
                    'Detection & Analysis',
                    'Containment & Recovery',
                    'Post-Incident Activity'
                ],
                correctAnswer: ['Preparation', 'Detection & Analysis', 'Containment & Recovery', 'Post-Incident Activity'],
                points: 20,
                explanation: 'Incident Response gồm: Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned.'
            },
            {
                questionText: 'Security Audit và Security Assessment khác nhau như thế nào?',
                questionType: 'single-choice',
                options: [
                    'Audit formal hơn và có thể bắt buộc',
                    'Assessment formal hơn',
                    'Không có sự khác biệt',
                    'Audit chỉ cho phần mềm'
                ],
                correctAnswer: 'Audit formal hơn và có thể bắt buộc',
                points: 10,
                explanation: 'Security Audit thường formal hơn, có thể bắt buộc bởi luật/regulation, trong khi Assessment linh hoạt hơn.'
            },
            {
                questionText: 'Risk = ?',
                questionType: 'single-choice',
                options: [
                    'Threat × Vulnerability × Impact',
                    'Threat + Vulnerability',
                    'Impact - Control',
                    'Random'
                ],
                correctAnswer: 'Threat × Vulnerability × Impact',
                points: 10,
                explanation: 'Risk được tính bằng: Threat (mối đe dọa) × Vulnerability (lỗ hổng) × Impact (tác động).'
            },
            {
                questionText: 'Security by Obscurity có nghĩa là:',
                questionType: 'single-choice',
                options: [
                    'Dựa vào việc giữ bí mật thiết kế hệ thống',
                    'Bảo mật tốt nhất',
                    'Không cần password',
                    'Open source security'
                ],
                correctAnswer: 'Dựa vào việc giữ bí mật thiết kế hệ thống',
                points: 10,
                explanation: 'Security by Obscurity dựa vào giữ bí mật cách hoạt động của hệ thống, không được khuyến khích vì không an toàn.'
            }
        ]
    }
];

// Data mẫu - Quizzes Thực hành
const practicalQuizzes = [
    {
        title: 'Thực hành Nmap - Network Scanning',
        description: 'Bài thực hành sử dụng Nmap để scan mạng và phát hiện services',
        type: 'practical',
        difficulty: 'easy',
        timeLimit: 30,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết lệnh Nmap để scan tất cả ports TCP trên host 192.168.1.1',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -p- để scan tất cả ports',
                expectedOutput: 'nmap -p- 192.168.1.1'
            },
            {
                questionText: 'Viết lệnh Nmap để phát hiện operating system của host 10.0.0.1',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -O cho OS detection',
                expectedOutput: 'nmap -O 10.0.0.1'
            },
            {
                questionText: 'Viết lệnh Nmap để scan nhanh 100 ports phổ biến nhất',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -F cho fast scan',
                expectedOutput: 'nmap -F 192.168.1.1'
            },
            {
                questionText: 'Viết lệnh Nmap để scan với service version detection trên host scanme.nmap.org',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -sV',
                expectedOutput: 'nmap -sV scanme.nmap.org'
            },
            {
                questionText: 'Viết lệnh Nmap để scan một subnet 192.168.1.0/24 và lưu kết quả vào file output.xml',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -oX để output XML',
                expectedOutput: 'nmap -oX output.xml 192.168.1.0/24'
            }
        ]
    },
    {
        title: 'Thực hành Wireshark - Packet Analysis',
        description: 'Bài thực hành phân tích network traffic với Wireshark',
        type: 'practical',
        difficulty: 'medium',
        timeLimit: 35,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết Wireshark filter để hiển thị chỉ HTTP traffic',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng protocol name',
                expectedOutput: 'http'
            },
            {
                questionText: 'Viết filter để hiển thị packets từ IP source 192.168.1.100',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng ip.src',
                expectedOutput: 'ip.src == 192.168.1.100'
            },
            {
                questionText: 'Viết filter để hiển thị TCP packets đến port 443',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng tcp.dstport',
                expectedOutput: 'tcp.dstport == 443'
            },
            {
                questionText: 'Viết filter để hiển thị DNS queries',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng dns và query type',
                expectedOutput: 'dns.flags.response == 0'
            },
            {
                questionText: 'Viết filter để hiển thị packets chứa string "password" trong payload',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng contains operator',
                expectedOutput: 'frame contains "password"'
            }
        ]
    },
    {
        title: 'Thực hành SQLMap - SQL Injection Testing',
        description: 'Bài thực hành sử dụng SQLMap để test SQL Injection',
        type: 'practical',
        difficulty: 'medium',
        timeLimit: 40,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết lệnh SQLMap để test URL http://testsite.com/page.php?id=1',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng option -u',
                expectedOutput: 'sqlmap -u "http://testsite.com/page.php?id=1"'
            },
            {
                questionText: 'Viết lệnh SQLMap để lấy danh sách databases từ vulnerable URL',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng --dbs option',
                expectedOutput: 'sqlmap -u "http://testsite.com/page.php?id=1" --dbs'
            },
            {
                questionText: 'Viết lệnh SQLMap để dump database "users"',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng -D và --dump',
                expectedOutput: 'sqlmap -u "http://testsite.com/page.php?id=1" -D users --dump'
            },
            {
                questionText: 'Viết lệnh SQLMap với POST method và data "username=admin&password=pass"',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng --data option',
                expectedOutput: 'sqlmap -u "http://testsite.com/login.php" --data="username=admin&password=pass"'
            },
            {
                questionText: 'Viết lệnh SQLMap với cookie "PHPSESSID=abc123"',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng --cookie option',
                expectedOutput: 'sqlmap -u "http://testsite.com/page.php?id=1" --cookie="PHPSESSID=abc123"'
            }
        ]
    },
    {
        title: 'Thực hành John the Ripper - Password Cracking',
        description: 'Bài thực hành crack password với John the Ripper',
        type: 'practical',
        difficulty: 'medium',
        timeLimit: 35,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết lệnh John để crack file passwords.txt với wordlist rockyou.txt',
                questionType: 'command',
                points: 25,
                commandHint: 'Sử dụng --wordlist option',
                expectedOutput: 'john --wordlist=rockyou.txt passwords.txt'
            },
            {
                questionText: 'Viết lệnh John để hiển thị passwords đã crack được',
                questionType: 'command',
                points: 25,
                commandHint: 'Sử dụng --show option',
                expectedOutput: 'john --show passwords.txt'
            },
            {
                questionText: 'Viết lệnh John để crack với incremental mode',
                questionType: 'command',
                points: 25,
                commandHint: 'Sử dụng --incremental option',
                expectedOutput: 'john --incremental passwords.txt'
            },
            {
                questionText: 'Viết lệnh John để crack với specific format MD5',
                questionType: 'command',
                points: 25,
                commandHint: 'Sử dụng --format option',
                expectedOutput: 'john --format=raw-md5 passwords.txt'
            }
        ]
    },
    {
        title: 'Thực hành Metasploit Framework',
        description: 'Bài thực hành sử dụng Metasploit Framework cho penetration testing',
        type: 'practical',
        difficulty: 'hard',
        timeLimit: 45,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết lệnh để search exploits liên quan đến "apache" trong Metasploit',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng search command',
                expectedOutput: 'search apache'
            },
            {
                questionText: 'Viết lệnh để sử dụng module exploit/windows/smb/ms17_010_eternalblue',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng use command',
                expectedOutput: 'use exploit/windows/smb/ms17_010_eternalblue'
            },
            {
                questionText: 'Viết lệnh để set RHOST (remote host) thành 192.168.1.100',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng set command',
                expectedOutput: 'set RHOST 192.168.1.100'
            },
            {
                questionText: 'Viết lệnh để xem các options của module hiện tại',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng show hoặc options',
                expectedOutput: 'show options'
            },
            {
                questionText: 'Viết lệnh để chạy exploit',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng exploit hoặc run',
                expectedOutput: 'exploit'
            }
        ]
    },
    {
        title: 'Thực hành Linux Security Commands',
        description: 'Bài thực hành các lệnh bảo mật Linux cơ bản',
        type: 'practical',
        difficulty: 'easy',
        timeLimit: 30,
        passingScore: 70,
        category: 'tools',
        totalPoints: 100,
        questions: [
            {
                questionText: 'Viết lệnh để thay đổi quyền file config.txt thành read-only cho owner (400)',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng chmod',
                expectedOutput: 'chmod 400 config.txt'
            },
            {
                questionText: 'Viết lệnh để tìm tất cả files có SUID bit set trong /usr/bin',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng find với -perm',
                expectedOutput: 'find /usr/bin -perm -4000'
            },
            {
                questionText: 'Viết lệnh để xem active network connections và listening ports',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng netstat hoặc ss',
                expectedOutput: 'netstat -tuln'
            },
            {
                questionText: 'Viết lệnh để xem last login attempts',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng last command',
                expectedOutput: 'last'
            },
            {
                questionText: 'Viết lệnh để check open ports trên localhost với netcat',
                questionType: 'command',
                points: 20,
                commandHint: 'Sử dụng nc với options -zv',
                expectedOutput: 'nc -zv localhost 1-1000'
            }
        ]
    }
];

// Hàm seed data
const seedData = async () => {
    try {
        console.log('Bắt đầu xóa dữ liệu cũ...');
        await User.deleteMany({});
        await Quiz.deleteMany({});
        console.log('Đã xóa dữ liệu cũ');

        console.log('Đang tạo users mẫu...');
        const users = await User.create(sampleUsers);
        console.log(`Đã tạo ${users.length} users`);

        console.log('Đang tạo quizzes trắc nghiệm...');
        const mcQuizzes = await Quiz.create(multipleChoiceQuizzes);
        console.log(`Đã tạo ${mcQuizzes.length} quizzes trắc nghiệm`);

        console.log('Đang tạo quizzes thực hành...');
        const practQuizzes = await Quiz.create(practicalQuizzes);
        console.log(`Đã tạo ${practQuizzes.length} quizzes thực hành`);

        console.log('\n✅ Seed data thành công!');
        console.log('\n📊 Thống kê:');
        console.log(`   - Users: ${users.length}`);
        console.log(`   - Quizzes trắc nghiệm: ${mcQuizzes.length}`);
        console.log(`   - Quizzes thực hành: ${practQuizzes.length}`);
        console.log(`   - Tổng quizzes: ${mcQuizzes.length + practQuizzes.length}`);

        console.log('\n👤 Tài khoản test:');
        console.log('   Admin:');
        console.log('   - Username: admin');
        console.log('   - Password: admin123');
        console.log('\n   Students:');
        console.log('   - Username: nguyenvana, Password: student123');
        console.log('   - Username: tranthib, Password: student123');
        console.log('   - Username: lequangc, Password: student123');
        console.log('   - Username: phamminhtd, Password: student123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi seed data:', error);
        process.exit(1);
    }
};

// Chạy seed
seedData();
