// Mock Exam Questions Data
const examQuestions = {
    1: {
        title: "Thi Giữa Kỳ - Lập trình Web",
        description: "Kiểm tra kiến thức lập trình Web",
        duration: 45, // minutes
        totalQuestions: 20,
        passingScore: 5.0,
        totalScore: 10,
        questions: [
            {
                id: 1,
                question: "HTML là viết tắt của gì?",
                options: [
                    { id: "a", text: "Hyper Text Markup Language" },
                    { id: "b", text: "High Tech Modern Language" },
                    { id: "c", text: "Home Tool Markup Language" },
                    { id: "d", text: "Hyperlinks and Text Markup Language" }
                ],
                correctAnswer: "a"
            },
            {
                id: 2,
                question: "CSS dùng để làm gì?",
                options: [
                    { id: "a", text: "Tạo cơ sở dữ liệu" },
                    { id: "b", text: "Định dạng và bố trí trang web" },
                    { id: "c", text: "Tạo logic cho ứng dụng" },
                    { id: "d", text: "Quản lý máy chủ" }
                ],
                correctAnswer: "b"
            },
            {
                id: 3,
                question: "JavaScript có thể chạy ở đâu?",
                options: [
                    { id: "a", text: "Chỉ trên máy chủ" },
                    { id: "b", text: "Chỉ trên trình duyệt" },
                    { id: "c", text: "Cả trên máy chủ và trình duyệt" },
                    { id: "d", text: "Chỉ trong cơ sở dữ liệu" }
                ],
                correctAnswer: "c"
            },
            {
                id: 4,
                question: "Thẻ nào dùng để tạo tiêu đề chính trong HTML?",
                options: [
                    { id: "a", text: "<title>" },
                    { id: "b", text: "<head>" },
                    { id: "c", text: "<h1>" },
                    { id: "d", text: "<header>" }
                ],
                correctAnswer: "c"
            },
            {
                id: 5,
                question: "Cách nào để thêm một comment trong JavaScript?",
                options: [
                    { id: "a", text: "<!-- comment -->" },
                    { id: "b", text: "// comment" },
                    { id: "c", text: "# comment" },
                    { id: "d", text: "* comment *" }
                ],
                correctAnswer: "b"
            },
            {
                id: 6,
                question: "Phương thức nào dùng để chọn element bằng ID trong JavaScript?",
                options: [
                    { id: "a", text: "getElementById()" },
                    { id: "b", text: "getElement()" },
                    { id: "c", text: "selectElement()" },
                    { id: "d", text: "findById()" }
                ],
                correctAnswer: "a"
            },
            {
                id: 7,
                question: "Giá trị mặc định của vị trí position trong CSS là gì?",
                options: [
                    { id: "a", text: "absolute" },
                    { id: "b", text: "relative" },
                    { id: "c", text: "static" },
                    { id: "d", text: "fixed" }
                ],
                correctAnswer: "c"
            },
            {
                id: 8,
                question: "Điều nào đúng về event listeners trong JavaScript?",
                options: [
                    { id: "a", text: "Chỉ có thể sử dụng một event listener trên một element" },
                    { id: "b", text: "Có thể sử dụng nhiều event listeners trên một element" },
                    { id: "c", text: "Event listeners không thể bị xoá" },
                    { id: "d", text: "Event listeners chỉ hoạt động với click" }
                ],
                correctAnswer: "b"
            },
            {
                id: 9,
                question: "Flexbox trong CSS là gì?",
                options: [
                    { id: "a", text: "Một loại font chữ" },
                    { id: "b", text: "Một mô hình bố trí linh hoạt" },
                    { id: "c", text: "Một thư viện JavaScript" },
                    { id: "d", text: "Một công cụ thiết kế" }
                ],
                correctAnswer: "b"
            },
            {
                id: 10,
                question: "Thẻ nào dùng để tạo danh sách không có thứ tự trong HTML?",
                options: [
                    { id: "a", text: "<ol>" },
                    { id: "b", text: "<ul>" },
                    { id: "c", text: "<li>" },
                    { id: "d", text: "<list>" }
                ],
                correctAnswer: "b"
            },
            {
                id: 11,
                question: "Biến trong JavaScript được khai báo bằng từ khóa nào?",
                options: [
                    { id: "a", text: "variable" },
                    { id: "b", text: "var, let, const" },
                    { id: "c", text: "v" },
                    { id: "d", text: "define" }
                ],
                correctAnswer: "b"
            },
            {
                id: 12,
                question: "Responsive website là gì?",
                options: [
                    { id: "a", text: "Website chỉ hoạt động trên máy tính" },
                    { id: "b", text: "Website thích ứng với các kích thước màn hình khác nhau" },
                    { id: "c", text: "Website chỉ hoạt động trên điện thoại" },
                    { id: "d", text: "Website không cần CSS" }
                ],
                correctAnswer: "b"
            },
            {
                id: 13,
                question: "Local Storage có thể lưu trữ bao nhiêu dữ liệu?",
                options: [
                    { id: "a", text: "1 KB" },
                    { id: "b", text: "Khoảng 5-10 MB" },
                    { id: "c", text: "Không giới hạn" },
                    { id: "d", text: "1 GB" }
                ],
                correctAnswer: "b"
            },
            {
                id: 14,
                question: "Phương thức nào dùng để chuyển đổi object thành JSON string?",
                options: [
                    { id: "a", text: "JSON.stringify()" },
                    { id: "b", text: "JSON.parse()" },
                    { id: "c", text: "JSON.toString()" },
                    { id: "d", text: "JSON.convert()" }
                ],
                correctAnswer: "a"
            },
            {
                id: 15,
                question: "Grid layout trong CSS có bao nhiêu chiều?",
                options: [
                    { id: "a", text: "1 chiều" },
                    { id: "b", text: "2 chiều" },
                    { id: "c", text: "3 chiều" },
                    { id: "d", text: "Không giới hạn" }
                ],
                correctAnswer: "b"
            },
            {
                id: 16,
                question: "Thẻ nào dùng để nhúng video trong HTML5?",
                options: [
                    { id: "a", text: "<video>" },
                    { id: "b", text: "<media>" },
                    { id: "c", text: "<embed>" },
                    { id: "d", text: "<film>" }
                ],
                correctAnswer: "a"
            },
            {
                id: 17,
                question: "Hàm setTimeout() trong JavaScript dùng để làm gì?",
                options: [
                    { id: "a", text: "Lặp lại một hàm nhiều lần" },
                    { id: "b", text: "Thực thi một hàm sau một khoảng thời gian" },
                    { id: "c", text: "Dừng chương trình" },
                    { id: "d", text: "Đo lường thời gian" }
                ],
                correctAnswer: "b"
            },
            {
                id: 18,
                question: "Placeholder attribute được sử dụng trong thẻ nào?",
                options: [
                    { id: "a", text: "<div>" },
                    { id: "b", text: "<input>" },
                    { id: "c", text: "<p>" },
                    { id: "d", text: "<span>" }
                ],
                correctAnswer: "b"
            },
            {
                id: 19,
                question: "Sự khác biệt chính giữa let và var trong JavaScript là gì?",
                options: [
                    { id: "a", text: "Không có sự khác biệt" },
                    { id: "b", text: "let có phạm vi block, var có phạm vi hàm" },
                    { id: "c", text: "var nhanh hơn let" },
                    { id: "d", text: "let không thể được gán lại" }
                ],
                correctAnswer: "b"
            },
            {
                id: 20,
                question: "Pseudo-element ::before trong CSS dùng để làm gì?",
                options: [
                    { id: "a", text: "Tạo nội dung trước element" },
                    { id: "b", text: "Tạo element mới" },
                    { id: "c", text: "Xoá element" },
                    { id: "d", text: "Thay đổi màu nền" }
                ],
                correctAnswer: "a"
            }
        ]
    },
    2: {
        title: "Thi Luyện Tập - Database",
        description: "Luyện tập cơ sở dữ liệu",
        duration: 60,
        totalQuestions: 30,
        passingScore: 5.0,
        totalScore: 10,
        questions: [
            {
                id: 1,
                question: "Database là gì?",
                options: [
                    { id: "a", text: "Một tập hợp dữ liệu được tổ chức" },
                    { id: "b", text: "Một ứng dụng di động" },
                    { id: "c", text: "Một trình duyệt web" },
                    { id: "d", text: "Một ngôn ngữ lập trình" }
                ],
                correctAnswer: "a"
            },
            {
                id: 2,
                question: "SQL viết tắt của gì?",
                options: [
                    { id: "a", text: "Structured Query Language" },
                    { id: "b", text: "Standard Question Language" },
                    { id: "c", text: "Simple Query Logic" },
                    { id: "d", text: "Sequential Query List" }
                ],
                correctAnswer: "a"
            },
            {
                id: 3,
                question: "SELECT * FROM users; lệnh này làm gì?",
                options: [
                    { id: "a", text: "Xoá tất cả người dùng" },
                    { id: "b", text: "Lấy tất cả dữ liệu từ bảng users" },
                    { id: "c", text: "Thêm người dùng mới" },
                    { id: "d", text: "Cập nhật người dùng" }
                ],
                correctAnswer: "b"
            },
            {
                id: 4,
                question: "Primary key là gì?",
                options: [
                    { id: "a", text: "Một khóa đặc biệt xác định duy nhất mỗi hàng" },
                    { id: "b", text: "Mật khẩu đăng nhập" },
                    { id: "c", text: "Một cột trong bảng" },
                    { id: "d", text: "Một nhận xét trong code" }
                ],
                correctAnswer: "a"
            },
            {
                id: 5,
                question: "Foreign key dùng để làm gì?",
                options: [
                    { id: "a", text: "Tạo mối quan hệ giữa các bảng" },
                    { id: "b", text: "Xác định giá trị duy nhất" },
                    { id: "c", text: "Tạo chỉ mục" },
                    { id: "d", text: "Mã hóa dữ liệu" }
                ],
                correctAnswer: "a"
            },
            {
                id: 6,
                question: "Normalization trong database là gì?",
                options: [
                    { id: "a", text: "Quá trình lưu trữ tất cả dữ liệu trong một bảng" },
                    { id: "b", text: "Quá trình tổ chức dữ liệu để loại bỏ dư thừa" },
                    { id: "c", text: "Quá trình xoá database" },
                    { id: "d", text: "Một loại backup" }
                ],
                correctAnswer: "b"
            },
            {
                id: 7,
                question: "ACID properties trong database bao gồm những gì?",
                options: [
                    { id: "a", text: "Atomicity, Consistency, Isolation, Durability" },
                    { id: "b", text: "Access, Control, Index, Data" },
                    { id: "c", text: "Aggregate, Cache, Insert, Delete" },
                    { id: "d", text: "Array, Compiler, Integer, Double" }
                ],
                correctAnswer: "a"
            },
            {
                id: 8,
                question: "JOIN trong SQL dùng để làm gì?",
                options: [
                    { id: "a", text: "Gộp dữ liệu từ nhiều bảng" },
                    { id: "b", text: "Xoá bảng" },
                    { id: "c", text: "Sao lưu database" },
                    { id: "d", text: "Tạo index" }
                ],
                correctAnswer: "a"
            },
            {
                id: 9,
                question: "INSERT INTO dùng để làm gì?",
                options: [
                    { id: "a", text: "Thêm dữ liệu mới vào bảng" },
                    { id: "b", text: "Lấy dữ liệu" },
                    { id: "c", text: "Cập nhật dữ liệu" },
                    { id: "d", text: "Xoá dữ liệu" }
                ],
                correctAnswer: "a"
            },
            {
                id: 10,
                question: "WHERE clause dùng để làm gì?",
                options: [
                    { id: "a", text: "Lọc dữ liệu dựa trên điều kiện" },
                    { id: "b", text: "Sắp xếp dữ liệu" },
                    { id: "c", text: "Nhóm dữ liệu" },
                    { id: "d", text: "Tham gia bảng" }
                ],
                correctAnswer: "a"
            },
            {
                id: 11,
                question: "Aggregate function COUNT() trả về điều gì?",
                options: [
                    { id: "a", text: "Số lượng hàng" },
                    { id: "b", text: "Giá trị tối đa" },
                    { id: "c", text: "Giá trị tối thiểu" },
                    { id: "d", text: "Tổng các giá trị" }
                ],
                correctAnswer: "a"
            },
            {
                id: 12,
                question: "INNER JOIN khác với LEFT JOIN ở điểm nào?",
                options: [
                    { id: "a", text: "INNER JOIN chỉ trả về các hàng khớp từ cả hai bảng" },
                    { id: "b", text: "LEFT JOIN trả về tất cả hàng từ bảng bên trái" },
                    { id: "c", text: "Không có sự khác biệt" },
                    { id: "d", text: "Cả A và B đều đúng" }
                ],
                correctAnswer: "d"
            },
            {
                id: 13,
                question: "Index trong database dùng để làm gì?",
                options: [
                    { id: "a", text: "Tăng tốc độ truy vấn" },
                    { id: "b", text: "Lưu trữ dữ liệu" },
                    { id: "c", text: "Xoá bảng" },
                    { id: "d", text: "Tạo backup" }
                ],
                correctAnswer: "a"
            },
            {
                id: 14,
                question: "Transaction trong database là gì?",
                options: [
                    { id: "a", text: "Một tập hợp các hoạt động DB được thực thi như một đơn vị" },
                    { id: "b", text: "Một sao lưu database" },
                    { id: "c", text: "Một người dùng database" },
                    { id: "d", text: "Một cột trong bảng" }
                ],
                correctAnswer: "a"
            },
            {
                id: 15,
                question: "GROUP BY dùng để làm gì?",
                options: [
                    { id: "a", text: "Nhóm hàng có cùng giá trị" },
                    { id: "b", text: "Lọc hàng" },
                    { id: "c", text: "Sắp xếp hàng" },
                    { id: "d", text: "Xoá hàng" }
                ],
                correctAnswer: "a"
            }
        ]
    },
    3: {
        title: "Thi Cuối Kỳ - Lập Trình Hướng Đối Tượng",
        description: "Kiểm tra OOP",
        duration: 90,
        totalQuestions: 25,
        passingScore: 5.0,
        totalScore: 10,
        questions: [
            {
                id: 1,
                question: "OOP là viết tắt của gì?",
                options: [
                    { id: "a", text: "Object Oriented Programming" },
                    { id: "b", text: "Object One Programming" },
                    { id: "c", text: "Object Online Protocol" },
                    { id: "d", text: "Open Operating Procedure" }
                ],
                correctAnswer: "a"
            },
            {
                id: 2,
                question: "Class trong OOP là gì?",
                options: [
                    { id: "a", text: "Một kế hoạch hoặc bản thiết kế cho một object" },
                    { id: "b", text: "Một instance của object" },
                    { id: "c", text: "Một hàm" },
                    { id: "d", text: "Một biến" }
                ],
                correctAnswer: "a"
            },
            {
                id: 3,
                question: "Encapsulation là khái niệm nào trong OOP?",
                options: [
                    { id: "a", text: "Gói dữ liệu và phương thức trong một lớp" },
                    { id: "b", text: "Kế thừa tính chất từ lớp cha" },
                    { id: "c", text: "Ghi đè phương thức" },
                    { id: "d", text: "Tạo nhiều object từ một class" }
                ],
                correctAnswer: "a"
            },
            {
                id: 4,
                question: "Inheritance trong OOP là gì?",
                options: [
                    { id: "a", text: "Kỹ thuật mà lớp con kế thừa tính chất từ lớp cha" },
                    { id: "b", text: "Gói dữ liệu và phương thức" },
                    { id: "c", text: "Một object có nhiều hình dạng" },
                    { id: "d", text: "Lưu trữ dữ liệu" }
                ],
                correctAnswer: "a"
            },
            {
                id: 5,
                question: "Polymorphism là khái niệm nào?",
                options: [
                    { id: "a", text: "Một object có thể có nhiều hình dạng" },
                    { id: "b", text: "Sao lưu dữ liệu" },
                    { id: "c", text: "Xoá object" },
                    { id: "d", text: "Tạo database" }
                ],
                correctAnswer: "a"
            }
        ]
    }
};
