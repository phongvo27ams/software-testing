# SOFTWARE TESTING

# Black Box Testing

## Boundary Value Analysis

### Room Booking Validation

Hệ thống đặt phòng của một trường đại học cho phép người dùng đăng ký đặt phòng bằng cách nhập các dữ liệu sau:

| Data field | Description | Valid range |
| --- | --- | --- |
| `Duration` | Thời gian sử dụng phòng tính bằng phút | 30 <= `Duration` <= 180 |
| `Number of Students` | Số lượng sinh viên tham gia | 1 <= `Number of Students` <= 50 |

Hệ thống áp dụng các quy tắc kiểm tra tính hợp lệ (validation rules) sau:
- Nếu `Duration` nhỏ hơn 30 hoặc lớn hơn 180, yêu cầu phải bị từ chối và hiển thị thông báo lỗi.
- Nếu `Number of Students` nhỏ hơn 1 hoặc lớn hơn 50, yêu cầu phải bị từ chối và hiển thị thông báo lỗi.
- Yêu cầu đặt phòng chỉ được chấp nhận khi cả hai trường dữ liệu đều nằm trong phạm vi hợp lệ của chúng.

Giả định các giá trị danh nghĩa (nominal values) như sau:
- Giá trị danh nghĩa của `Duration` là 90 phút.
- Giá trị danh nghĩa của `Number of Students` là 25 sinh viên.

Sử dụng Boundary Value Analysis (BVA), hãy thiết kế các tập test case cho hệ thống trên bằng cách áp dụng lần lượt bốn phương pháp sau: Normal BVA, Robust BVA, Worst-case BVA, và Robust Worst-case BVA. Đối với mỗi phương pháp, hãy giải thích cách tính số lượng test case được tạo ra, xác định các giá trị kiểm thử (test values) được chọn cho mỗi biến, và trình bày các test case dưới dạng bảng.

**Lời giải chi tiết**

Để thiết kế BVA test set, trước tiên ta cần xác định các phạm vi hợp lệ, giá trị danh nghĩa, và sau đó sinh ra các giá trị biên cho từng biến đầu vào. Có 2 biến đầu vào:

| Variable | Valid range | Nominal value |
| --- | --- | --- |
| `Duration` | 30 -> 180 | 90 |
| `Number of Students` | 1 -> 50 | 25 |

Hệ thống chấp nhận việc đặt phòng khi cả `Duration` và `Number of Students` đều hợp lệ. Nếu một hoặc cả hai biến không hợp lệ, hệ thống sẽ hiển thị lỗi tương ứng.

Đối với Normal BVA, ta chọn các giá trị biên và các giá trị ngay bên trong biên, sau đó thay đổi từng biến một trong khi giữ nguyên các biến khác ở giá trị danh nghĩa. Nghĩa là kiểm tra các giá trị biên hợp lệ và các giá trị cận biên hợp lệ, chỉ thay đổi một biến tại một thời điểm trong khi giữ biến còn lại ở giá trị danh nghĩa.

Đối với mỗi biến, ta chọn 5 giá trị:

| Variable | Normal BVA values |
| --- | --- |
| `Duration` | 30, 31, 90, 179, 180 |
| `Number of Students` | 1, 2, 25, 49, 50 |

Số lượng test case là:

$$
4n + 1 = 4 \times 2 + 1 = 9\ \text{test cases}
$$

Thiết kế bảng test case:

| Test case | `Duration` | `Number of Students` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 90 | 25 | Accept booking |
| TC-002 | 30 | 25 | Accept booking |
| TC-003 | 31 | 25 | Accept booking |
| TC-004 | 179 | 25 | Accept booking |
| TC-005 | 180 | 25 | Accept booking |
| TC-006 | 90 | 1 | Accept booking |
| TC-007 | 90 | 2 | Accept booking |
| TC-008 | 90 | 49 | Accept booking |
| TC-009 | 90 | 50 | Accept booking |

Đối với Robust BVA, ta thêm các giá trị ngay bên ngoài mỗi biên hợp lệ để có thể kiểm thử cả các trường hợp biên hợp lệ và không hợp lệ. Đối với mỗi biến, ta chọn 7 giá trị:

| Variable | Robust BVA values |
| --- | --- |
| `Duration` | 29, 30, 31, 90, 179, 180, 181 |
| `Number of Students` | 0, 1, 2, 25, 49, 50, 51 |

Số lượng test case là:

$$
6n + 1 = 6 \times 2 + 1 = 13\ \text{test cases}
$$

Thiết kế bảng test case:

| Test case | `Duration` | `Number of Students` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 90 | 25 | Accept booking |
| TC-002 | 29 | 25 | Error: invalid `Duration` |
| TC-003 | 30 | 25 | Accept booking |
| TC-004 | 31 | 25 | Accept booking |
| TC-005 | 179 | 25 | Accept booking |
| TC-006 | 180 | 25 | Accept booking |
| TC-007 | 181 | 25 | Error: invalid `Duration` |
| TC-008 | 90 | 0 | Error: invalid `Number of Students` |
| TC-009 | 90 | 1 | Accept booking |
| TC-010 | 90 | 2 | Accept booking |
| TC-011 | 90 | 49 | Accept booking |
| TC-012 | 90 | 50 | Accept booking |
| TC-013 | 90 | 51 | Error: invalid `Number of Students` |

Đối với Worst-case BVA, ta sử dụng các giá trị biên hợp lệ giống như Normal BVA, nhưng kiểm thử tất cả các kết hợp giữa các biến bằng cách lấy tích Cartesian của các giá trị biên hợp lệ.

| Variable | Worst-case BVA values |
| --- | --- |
| `Duration` | 30, 31, 90, 179, 180 |
| `Number of Students` | 1, 2, 25, 49, 50 |

Số lượng test case là:

$$
5^n = 5^2 = 25\ \text{test cases}
$$

Thiết kế bảng test case:

| Test case | `Duration` | `Number of Students` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 30 | 1 | Accept booking |
| TC-002 | 30 | 2 | Accept booking |
| TC-003 | 30 | 25 | Accept booking |
| TC-004 | 30 | 49 | Accept booking |
| TC-005 | 30 | 50 | Accept booking |
| TC-006 | 31 | 1 | Accept booking |
| TC-007 | 31 | 2 | Accept booking |
| TC-008 | 31 | 25 | Accept booking |
| TC-009 | 31 | 49 | Accept booking |
| TC-010 | 31 | 50 | Accept booking |
| TC-011 | 90 | 1 | Accept booking |
| TC-012 | 90 | 2 | Accept booking |
| TC-013 | 90 | 25 | Accept booking |
| TC-014 | 90 | 49 | Accept booking |
| TC-015 | 90 | 50 | Accept booking |
| TC-016 | 179 | 1 | Accept booking |
| TC-017 | 179 | 2 | Accept booking |
| TC-018 | 179 | 25 | Accept booking |
| TC-019 | 179 | 49 | Accept booking |
| TC-020 | 179 | 50 | Accept booking |
| TC-021 | 180 | 1 | Accept booking |
| TC-022 | 180 | 2 | Accept booking |
| TC-023 | 180 | 25 | Accept booking |
| TC-024 | 180 | 49 | Accept booking |
| TC-025 | 180 | 50 | Accept booking |

Đối với Robust Worst-case BVA, ta sử dụng cả giá trị hợp lệ và không hợp lệ gần biên, và kiểm thử tất cả các kết hợp bằng cách lấy tích Cartesian của các giá trị biên, cận biên và ngoài phạm vi.

| Variable | Worst-case BVA values |
| --- | --- |
| `Duration` | 29, 30, 31, 90, 179, 180, 181 |
| `Number of Students` | 0, 1, 2, 25, 49, 50, 51 |

Số lượng test case là:

$$
7^n = 7^2 = 49\ \text{test cases}
$$

Thiết kế bảng test case:

| Test case | `Duration` | `Number of Students` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 29 | 0 | Error: invalid `Duration` and `Number of Students` |
| TC-002 | 29 | 1 | Error: invalid `Duration` |
| TC-003 | 29 | 2 | Error: invalid `Duration` |
| TC-004 | 29 | 25 | Error: invalid `Duration` |
| TC-005 | 29 | 49 | Error: invalid `Duration` |
| TC-006 | 29 | 50 | Error: invalid `Duration` |
| TC-007 | 29 | 51 | Error: invalid `Duration` and `Number of Students` |
| TC-008 | 30 | 0 | Error: invalid `Number of Students` |
| TC-009 | 30 | 1 | Accept booking |
| TC-010 | 30 | 2 | Accept booking |
| TC-011 | 30 | 25 | Accept booking |
| TC-012 | 30 | 49 | Accept booking |
| TC-013 | 30 | 50 | Accept booking |
| TC-014 | 30 | 51 | Error: invalid `Number of Students` |
| ... | ... | ... | ... |
| TC-049 | 181 | 51 | Error: invalid `Duration` and `Number of Students` |

Kỹ thuật tối ưu trong dạng bài tập này thường là Robust BVA. Lý do là bài có 2 input dạng số, mỗi input đều có miền hợp lệ rõ ràng. Các lỗi thường xuất hiện ở ngay sát biên.

Nếu chỉ dùng Normal BVA, ta không kiểm tra dữ liệu ngoài biên như 29, 181, 0, 51, nên chưa đủ tốt cho validation. Nếu dùng Worst-case BVA, ta có 25 test case, nhưng vẫn không kiểm tra invalid. Nếu dùng Robust Worst-case BVA, ta có 49 test case. Độ phủ cao nhất, nhưng khá tốn công và nhiều trường hợp có thể dư thừa nếu `Duration` và Students được validate độc lập.

Vì vậy, Robust BVA là lựa chọn cân bằng nhất: chỉ cần 13 test case nhưng vẫn kiểm tra được cả biên hợp lệ và biên không hợp lệ. Đây là kỹ thuật vừa đủ mạnh để bắt lỗi validation ở biên, vừa không làm số lượng test case tăng quá nhiều.

### Seminar Registration System

Hệ thống đăng ký hội thảo học thuật của một trường đại học cho phép người dùng nhập các thông tin sau:

| Data field | Description | Valid range |
| --- | --- | --- |
| `Age` | Tuổi của người tham gia | 18 <= `Age` <= 65 |
| `Experience` | Số năm kinh nghiệm nghiên cứu | 0 <= `Experience` <= 40 |
| `Registration Days Before Event` | Số ngày người dùng đăng ký trước ngày diễn ra hội thảo | 1 <= `Registration Days Before Event` <= 180 |
| `Number of Workshops` | Số lượng workshop người dùng muốn tham dự | 1 <= `Number of Workshops` <= 10 |

Hệ thống áp dụng các quy tắc validation sau:
- Nếu `Age` nhỏ hơn 18 hoặc lớn hơn 65, việc đăng ký phải bị từ chối và hiển thị thông báo lỗi.
- Nếu `Experience` nhỏ hơn 0 hoặc lớn hơn 40, việc đăng ký phải bị từ chối và hiển thị thông báo lỗi.
- Nếu `Registration Days Before Event` nhỏ hơn 1 hoặc lớn hơn 180, việc đăng ký phải bị từ chối và hiển thị thông báo lỗi.
- Nếu `Number of Workshops` nhỏ hơn 1 hoặc lớn hơn 10, việc đăng ký phải bị từ chối và hiển thị thông báo lỗi.
- Việc đăng ký chỉ được chấp nhận khi tất cả các trường dữ liệu đều nằm trong phạm vi hợp lệ của chúng.

Giả định các giá trị nominal như sau:
- `Age` = 30
- `Experience` = 10
- `Registration Days Before Event` = 90
- `Number of Workshops` = 5

Sử dụng Boundary Value Analysis (BVA), hãy thiết kế các tập test case cho hệ thống trên bằng cách áp dụng lần lượt bốn phương pháp sau: Normal BVA, Robust BVA, Worst-case BVA, và Robust Worst-case BVA. Đối với mỗi phương pháp:
- Giải thích cách tính số lượng test case được tạo ra.
- Xác định các giá trị kiểm thử được chọn cho mỗi biến.
- Trình bày các test case dưới dạng bảng.
- Đối với Worst-case BVA và Robust Worst-case BVA, chỉ trình bày một vài test case đại diện.

**Lời giải chi tiết**

Để thiết kế các tập test case BVA, trước ta cần xác định các phạm vi hợp lệ, các giá trị nominal, và các giá trị biên cho từng biến đầu vào. Có 4 biến đầu vào:

| Variable | Valid range | Nominal value |
| --- | --- | --- |
| `Age` | 18 -> 65 | 30 |
| `Experience` | 0 -> 40 | 10 |
| `Registration Days Before Event` | 1 -> 180 | 90 |
| `Number of Workshops` | 1 -> 10 | 5 |

Hệ thống chỉ chấp nhận đăng ký khi tất cả các biến đều hợp lệ. Nếu một hoặc nhiều biến không hợp lệ, hệ thống sẽ hiển thị lỗi tương ứng.

Đối với Normal BVA, ta kiểm tra các giá trị biên hợp lệ và các giá trị hợp lệ cận biên. Chỉ có một biến được thay đổi tại một thời điểm trong khi các biến khác giữ nguyên ở giá trị nominal.

Đối với mỗi biến, ta chọn 5 giá trị:

| Variable | Normal BVA values |
| --- | --- |
| `Age` | 18, 19, 30, 64, 65 |
| `Experience` | 0, 1, 10, 39, 40 |
| `Registration Days Before Event` | 1, 2, 90, 179, 180 |
| `Number of Workshops` | 1, 2, 5, 9, 10 |

Số lượng test case là:

$$
4n + 1 = 4 \times 4 + 1 = 17\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age` | `Experience` | `Registration Days Before Event` | Workshops | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 30 | 10 | 90 | 5 | Accept registration |
| TC-002 | 18 | 10 | 90 | 5 | Accept registration |
| TC-003 | 19 | 10 | 90 | 5 | Accept registration |
| TC-004 | 64 | 10 | 90 | 5 | Accept registration |
| TC-005 | 65 | 10 | 90 | 5 | Accept registration |
| TC-006 | 30 | 0 | 90 | 5 | Accept registration |
| TC-007 | 30 | 1 | 90 | 5 | Accept registration |
| TC-008 | 30 | 39 | 90 | 5 | Accept registration |
| TC-009 | 30 | 40 | 90 | 5 | Accept registration |
| TC-010 | 30 | 10 | 1 | 5 | Accept registration |
| TC-011 | 30 | 10 | 2 | 5 | Accept registration |
| TC-012 | 30 | 10 | 179 | 5 | Accept registration |
| TC-013 | 30 | 10 | 180 | 5 | Accept registration |
| TC-014 | 30 | 10 | 90 | 1 | Accept registration |
| TC-015 | 30 | 10 | 90 | 2 | Accept registration |
| TC-016 | 30 | 10 | 90 | 9 | Accept registration |
| TC-017 | 30 | 10 | 90 | 10 | Accept registration |

Đối với Robust BVA, ta kiểm tra cả giá trị hợp lệ và giá trị không hợp lệ ngay bên ngoài các đường biên. Chỉ có một biến được thay đổi tại một thời điểm trong khi các biến khác giữ nguyên ở giá trị nominal.

Đối với mỗi biến, ta chọn 7 giá trị:

| Variable | Normal BVA values |
| --- | --- |
| `Age` | 17, 18, 19, 30, 64, 65, 66 |
| `Experience` | -1, 0, 1, 10, 39, 40, 41 |
| `Registration Days Before Event` | 0, 1, 2, 90, 179, 180, 181 |
| `Number of Workshops` | 0, 1, 2, 5, 9, 10, 11 |

Số lượng test case là:

$$
6n + 1 = 6 \times 4 + 1 = 25\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age` | `Experience` | `Registration Days Before Event` | Workshops | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 30 | 10 | 90 | 5 | Accept registration |
| TC-002 | 17 | 10 | 90 | 5 | Error: invalid `Age` |
| TC-003 | 18 | 10 | 90 | 5 | Accept registration |
| TC-004 | 19 | 10 | 90 | 5 | Accept registration |
| TC-005 | 64 | 10 | 90 | 5 | Accept registration |
| TC-006 | 65 | 10 | 90 | 5 | Accept registration |
| TC-007 | 66 | 10 | 90 | 5 | Error: invalid `Age` |
| TC-008 | 30 | -1 | 90 | 5 | Error: invalid `Experience` |
| TC-009 | 30 | 0 | 90 | 5 | Accept registration |
| TC-010 | 30 | 1 | 90 | 5 | Accept registration |
| TC-011 | 30 | 39 | 90 | 5 | Accept registration |
| TC-012 | 30 | 40 | 90 | 5 | Accept registration |
| TC-013 | 30 | 41 | 90 | 5 | Error: invalid `Experience` |
| TC-014 | 30 | 10 | 0 | 5 | Error: invalid `Registration Days Before Event` |
| TC-015 | 30 | 10 | 1 | 5 | Accept registration |
| TC-016 | 30 | 10 | 2 | 5 | Accept registration |
| TC-017 | 30 | 10 | 179 | 5 | Accept registration |
| TC-018 | 30 | 10 | 180 | 5 | Accept registration |
| TC-019 | 30 | 10 | 181 | 5 | Error: invalid `Registration Days Before Event` |
| TC-020 | 30 | 10 | 90 | 0 | Error: invalid `Number of Workshops` |
| TC-021 | 30 | 10 | 90 | 1 | Accept registration |
| TC-022 | 30 | 10 | 90 | 2 | Accept registration |
| TC-023 | 30 | 10 | 90 | 9 | Accept registration |
| TC-024 | 30 | 10 | 90 | 10 | Accept registration |
| TC-025 | 30 | 10 | 90 | 11 | Error: invalid `Number of Workshops` |

Đối với Worst-case BVA, ta sử dụng các giá trị biên hợp lệ tương tự như Normal BVA, nhưng kiểm thử tất cả các kết hợp giữa các biến bằng cách lấy tích Cartesian của các giá trị biên hợp lệ.

Đối với mỗi biến, ta chọn 5 giá trị:

| Variable | Normal BVA values |
| --- | --- |
| `Age` | 18, 19, 30, 64, 65 |
| `Experience` | 0, 1, 10, 39, 40 |
| `Registration Days Before Event` | 1, 2, 90, 179, 180 |
| `Number of Workshops` | 1, 2, 5, 9, 10 |

Số lượng test case là:

$$
5^n = 5^4 = 625\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age` | `Experience` | `Registration Days Before Event` | Workshops | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 18 | 0 | 1 | 1 | Accept registration |
| TC-002 | 19 | 0 | 1 | 1 | Accept registration |
| TC-003 | 30 | 0 | 1 | 1 | Accept registration |
| TC-004 | 64 | 0 | 1 | 1 | Accept registration |
| TC-005 | 65 | 0 | 1 | 1 | Accept registration |
| ... | ... | ... | ... | ... | ... |
| TC-625 | 65 | 40 | 180 | 10 | Accept registration |

Đối với Robust Worst-case BVA, ta sử dụng cả giá trị hợp lệ và không hợp lệ gần các đường biên, đồng thời kiểm thử tất cả các kết hợp giữa các biến.

Đối với mỗi biến, ta chọn 7 giá trị:

| Variable | Normal BVA values |
| --- | --- |
| `Age` | 17, 18, 19, 30, 64, 65, 66 |
| `Experience` | -1, 0, 1, 10, 39, 40, 41 |
| `Registration Days Before Event` | 0, 1, 2, 90, 179, 180, 181 |
| `Number of Workshops` | 0, 1, 2, 5, 9, 10, 11 |

Số lượng test case là:

$$
7^n = 7^4 = 2401\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age` | `Experience` | `Registration Days Before Event` | Workshops | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 17 | 0 | 1 | 1 | Error: invalid `Age` |
| TC-002 | 18 | 0 | 1 | 1 | Accept registration |
| TC-003 | 19 | 0 | 1 | 1 | Accept registration |
| TC-004 | 30 | 0 | 1 | 1 | Accept registration |
| TC-005 | 64 | 0 | 1 | 1 | Accept registration |
| TC-006 | 65 | 0 | 1 | 1 | Accept registration |
| TC-007 | 66 | 0 | 1 | 1 | Error: invalid `Age` |
| ... | ... | ... | ... | ... | ... |
| TC-2401 | 66 | 41 | 181 | 11 | Error: invalid `Age`, `Experience`, `Registration Days Before Event`, `Number of Workshops` |

## Equivalence Partitioning

### Movie Ticket Booking

Một hệ thống đặt vé xem phim cho phép khách hàng đặt vé bằng cách nhập hai thông tin:

| Data field | Description | Valid range |
| --- | --- | --- |
| `Age` | Tuổi của khách hàng | Child, Adult, Senior |
| `Seat type` | Loại ghế được chọn bởi khách hàng | S, P |

Hệ thống phải kiểm tra tính hợp lệ của dữ liệu đầu vào theo các quy tắc sau:

**Nhóm tuổi:**
- Khách hàng từ 6 đến 12 tuổi được xếp vào nhóm Child.
- Khách hàng từ 13 đến 59 tuổi được xếp vào nhóm Adult.
- Khách hàng từ 60 đến 80 tuổi được xếp vào nhóm Senior.
- Bất kỳ độ tuổi nào nhỏ hơn 6 hoặc lớn hơn 80 đều không hợp lệ.

**Loại ghế:**
- Ghế Standard được nhập là S.
- Ghế Premium được nhập là P.
- Nếu không có loại ghế nào được chọn, hệ thống phải hiển thị thông báo lỗi.
- Nếu người dùng nhập bất kỳ giá trị nào khác ngoài S hoặc P, hệ thống phải hiển thị thông báo lỗi.

Yêu cầu đặt vé chỉ được chấp nhận khi cả `Age` và `Seat type` đều hợp lệ.

Sử dụng Equivalence Class Partitioning (ECP), hãy thiết kế các tập test case cho hệ thống trên bằng cách áp dụng lần lượt bốn kỹ thuật sau: Weak Normal ECP, Strong Normal ECP, Weak Robust ECP, và Strong Robust ECP. Đối với mỗi kỹ thuật:
- Giải thích cách xác định số lượng test case được tạo ra.
- Xác định các tương đương (equivalence classes) được sử dụng cho mỗi đầu vào.
- Trình bày các test case dưới dạng bảng.
- Đối với Strong Robust ECP, chỉ trình bày một vài test case đại diện.

**Lời giải chi tiết**

Để thiết kế các tập test case ECP, trước tiên ta cần xác định các equivalence classes cho từng biến đầu vào. Hệ thống chỉ chấp nhận đặt vé khi cả hai đầu vào đều thuộc về các equivalence classes hợp lệ:

| Variable | Equivalence class | Value | Type |
| --- | --- | --- | --- |
| `Age group` | EC1 | 6-12 | Valid: Child |
| `Age group` | EC2 | 13-59 | Valid: Adult |
| `Age group` | EC3 | 60-80 | Valid: Senior |
| `Age group` | EC4 | < 6 | Invalid |
| `Age group` | EC5 | > 80 | Invalid |
| `Seat type` | EC6 | S | Valid: Standard |
| `Seat type` | EC7 | P | Valid: Premium |
| `Seat type` | EC8 | Blank | Invalid |
| `Seat type` | EC9 | X | Invalid |

Đối với Weak Normal ECP, ta chọn một đại diện từ mỗi lớp hợp lệ và đảm bảo mọi lớp hợp lệ đều xuất hiện ít nhất một lần: EC1, EC2, EC3, EC6, EC7.

Thiết kế test case:

| Test case | `Age group` | `Seat type` | Covered classes |
| --- | --- | --- | --- |
| TC-001 | 8 | S | EC1, EC6 |
| TC-002 | 25 | P | EC2, EC7 |
| TC-003 | 65 | S | EC3, EC6 |

Weak Normal ECP chỉ yêu cầu 3 test cases trong trường hợp này.

Đối với Weak Robust ECP, ta cần chọn cả lớp hợp lệ và không hợp lệ, nhưng vẫn chỉ yêu cầu mỗi lớp xuất hiện ít nhất một lần.

Thiết kế test case:

| Test case | `Age group` | `Seat type` | Covered classes |
| --- | --- | --- | --- |
| TC-001 | 8 | S | EC1, EC6 |
| TC-002 | 25 | P | EC2, EC7 |
| TC-003 | 65 | S | EC3, EC6 |
| TC-004 | 5 | S | EC4, EC6 |
| TC-005 | 81 | P | EC5, EC7 |
| TC-006 | 25 | Blank | EC2, EC8 |
| TC-007 | 25 | X | EC2, EC9 |

Weak Robust ECP yêu cầu 7 test cases trong trường hợp này, ta chỉ cần mỗi lớp xuất hiện ít nhất một lần, không cần kết hợp mọi invalid age với mọi invalid seat.

Đối với Strong Normal ECP, ta kết hợp tất cả các lớp hợp lệ trên tất cả các đầu vào sao cho mỗi lớp hợp lệ được ghép cặp với mọi lớp hợp lệ khác.

Có 3 lớp age hợp lệ và 2 lớp seat hợp lệ, do đó số lượng test case là:

$$
3 \times 2 = 6\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age group` | `Seat type` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 8 | S | Valid: Child, Standard |
| TC-002 | 8 | P | Valid: Child, Premium |
| TC-003 | 25 | S | Valid: Adult, Standard |
| TC-004 | 25 | P | Valid: Adult, Premium |
| TC-005 | 65 | S | Valid: Senior, Standard |
| TC-006 | 65 | P | Valid: Senior, Premium |

Đối với Strong Robust ECP, ta kết hợp tất cả các lớp hợp lệ và không hợp lệ trên tất cả các đầu vào, điều này tạo ra tập hợp lớn nhất.

Có 5 lớp age và 4 lớp seat, do đó số lượng test case là:

$$
5 \times 4 = 20\ \text{test cases}
$$

Thiết kế test case:

| Test case | `Age group` | `Seat type` | Expected result |
| --- | --- | --- | --- |
| TC-001 | 8 | S | Valid: Child, Standard |
| TC-002 | 8 | P | Valid: Child, Premium |
| TC-003 | 8 | Blank | Invalid: Child, Missing seat type |
| TC-004 | 8 | X | Invalid: Child, Invalid seat type |
| TC-005 | 25 | S | Valid: Adult, Standard |
| TC-006 | 25 | P | Valid: Adult, Premium |
| TC-007 | 25 | Blank | Invalid: Adult, Missing seat type |
| TC-008 | 25 | X | Invalid: Adult, Invalid seat type |
| TC-009 | 65 | S | Valid: Senior, Standard |
| TC-010 | 65 | P | Valid: Senior, Premium |
| TC-011 | 65 | Blank | Invalid: Senior, Missing seat type |
| TC-012 | 65 | X | Invalid: Senior, Invalid seat type |
| TC-013 | 5 | S | Invalid: Under 6, Standard |
| TC-014 | 5 | P | Invalid: Under 6, Premium |
| TC-015 | 5 | Blank | Invalid: Under 6, Missing seat type |
| TC-016 | 5 | X | Invalid: Under 6, Invalid seat type |
| TC-017 | 81 | S | Invalid: Over 80, Standard |
| TC-018 | 81 | P | Invalid: Over 80, Premium |
| TC-019 | 81 | Blank | Invalid: Over 80, Missing seat type |
| TC-020 | 81 | X | Invalid: Over 80, Invalid seat type |

Với tình huống bài tập đặt vé xem phim ở trên, kỹ thuật tối ưu nhất thường là Weak Robust ECP. Lý do là bài có cả dữ liệu hợp lệ và không hợp lệ: tuổi < 6, tuổi > 80, không chọn seat, chọn sai seat. Vì vậy nếu chỉ dùng Normal ECP thì chưa đủ tốt, vì nó bỏ qua các trường hợp lỗi. Tuy nhiên nếu dùng Strong Robust ECP thì quá nhiều test case: 20 test cases. Cách này phủ rất kỹ nhưng không tối ưu về thời gian, nhất là khi đây chỉ là bài toán có logic nhập liệu đơn giản.

### Smart Locker System

Một hệ thống tủ gửi đồ tự động thông minh trong trường đại học cho phép sinh viên đặt tủ bằng cách nhập hai thông tin sau:

| Data field | Description | Valid range |
| --- | --- | --- |
| `Duration` | Thời gian gửi đồ (tính bằng phút) | 1 ≤ `Duration` ≤ 120 |
| `Locker size` | Loại tủ được chọn bởi người dùng | S, L, X |

Hệ thống kiểm tra tính hợp lệ và xử lý tính phí theo các quy tắc:
- Thời gian gửi đồ (`Duration`):
- Từ 1 đến dưới 30 phút: Miễn phí (0 USD).
- Từ 30 đến 120 phút: Phí cơ bản 1 USD.
- Nhỏ hơn 1 phút hoặc lớn hơn 120 phút: Không hợp lệ.
- Loại tủ (`Locker size`):
- Tủ nhỏ (S): Phụ phí +0 USD.
- Tủ lớn (L): Phụ phí +1 USD.
- Tủ cực lớn (X): Phụ phí +1.5 USD.

Nếu không chọn kích thước tủ hoặc nhập giá trị khác ngoài S, L, X: Không hợp lệ. Yêu cầu đặt tủ chỉ thành công khi cả `Duration` và `Locker size` đều hợp lệ. Khi vi phạm bất kỳ điều kiện nào, hệ thống hiển thị trạng thái lỗi và phát ra tiếng bíp.

Sử dụng kỹ thuật Equivalence Partitioning (ECP), hãy thiết kế các tập test case bằng cách áp dụng lần lượt bốn phương pháp: Weak Normal ECP, Strong Normal ECP, Weak Robust ECP, và Strong Robust ECP. Đối với mỗi kỹ thuật:
- Giải thích cách xác định số lượng test case.
- Xác định các tương đương (equivalence classes) cho từng đầu vào.
- Trình bày các test case dưới dạng bảng (đối với Strong Robust ECP, chỉ trình bày một vài test case đại diện).

**Lời giải chi tiết**

Để thiết kế các tập test case ECP, trước tiên ta cần xác định các equivalence classes cho từng biến đầu vào. Hệ thống chỉ chấp nhận yêu cầu đặt tủ khi cả hai đầu vào đều thuộc về các equivalence classes hợp lệ:

| Variable | Equivalence class | Value | Type |
| --- | --- | --- | --- |
| `Duration` | EC1 | 1-29 | Valid: Free |
| `Duration` | EC2 | 30-119 | Valid: Charged |
| `Duration` | EC3 | < 1 | Invalid |
| `Duration` | EC4 | > 120 | Invalid |
| `Locker size` | EC5 | S | Valid: Small |
| `Locker size` | EC6 | L | Valid: Large |
| `Locker size` | EC7 | X | Valid: Extra Large |
| `Locker size` | EC8 | Blank | Invalid: Missing |
| `Locker size` | EC9 | Y | Invalid: Other character |

Đối với Weak Normal ECP, ta chọn một đại diện từ mỗi lớp hợp lệ và đảm bảo mọi lớp hợp lệ đều xuất hiện ít nhất một lần: EC1, EC2, EC5, EC6, EC7.

Số lượng test case: Do biến `Locker size` có số lớp hợp lệ lớn nhất (3 lớp), số lượng test case tối thiểu là 3.

| Test case | `Duration` | `Locker size` | Covered classes | Expected Result |
| --- | --- | --- | --- | --- |
| TC-001 | 15 | S | EC1, EC6 | Success: Fee = 0 USD |
| TC-002 | 45 | L | EC2, EC6 | Success: Fee = 2 USD (1 + 1) |
| TC-003 | 60 | X | EC2, EC7 | Success: Fee = 2.5 USD (1 + 1.5) |

Đối với Weak Robust ECP, ta cần đảm bảo mọi lớp (cả hợp lệ lẫn không hợp lệ) xuất hiện ít nhất một lần. Áp dụng giả định lỗi đơn (Single Fault Assumption), mỗi test case không hợp lệ chỉ chứa đúng 1 giá trị không hợp lệ.

Số lượng test case: 3 (Normal) + 2 (Invalid `Duration`) + 2 (Invalid Size) = 7 test cases

| Test case | `Duration` | `Locker size` | Covered classes | Expected Result |
| --- | --- | --- | --- | --- |
| TC-001 | 15 | S | EC1, EC6 | Success: Fee = 0 USD |
| TC-002 | 45 | L | EC2, EC6 | Success: Fee = 2 USD (1 + 1) |
| TC-003 | 60 | X | EC2, EC7 | Success: Fee = 2.5 USD (1 + 1.5) |
| TC-004 | 0 | S | EC3, EC5 | Invalid: `Duration` < 1, Beep |
| TC-005 | 150 | L | EC4, EC6 | Invalid: `Duration` > 120, Beep |
| TC-006 | 45 | Blank | EC2, EC8 | Invalid: Missing locker size, Beep |
| TC-007 | 45 | K | EC2, EC9 | Invalid: Invalid locker size, Beep |

Đối với Strong Normal ECP, tất cả các lớp hợp lệ của biến này được kết hợp với tất cả các lớp hợp lệ của biến kia.

Có 2 lớp `Duration` hợp lệ và 3 lớp `Locker size` hợp lệ, do đó số lượng test case là:

$$
2 \times 3 = 6\ \text{test cases}
$$

| Test case | `Duration` | `Locker size` | Expected Result |
| --- | --- | --- | --- |
| TC-001 | 15 | S | Success: Fee = 0 USD |
| TC-002 | 15 | L | Success: Fee = 2 USD (1 + 1) |
| TC-003 | 15 | X | Success: Fee = 2.5 USD (1 + 1.5) |
| TC-004 | 45 | S | Success: Fee = 1 USD (1 + 0) |
| TC-005 | 45 | L | Success: Fee = 2 USD (1 + 1) |
| TC-006 | 45 | X | Success: Fee = 2.5 USD (1 + 1.5) |
| ... | ... | ... | ... |

Đối với Strong Robust ECP, ta kết hợp tất cả các lớp hợp lệ và không hợp lệ của mọi đầu vào.

Có 4 lớp `Duration` và 5 lớp `Locker size`, do đó số lượng test case là:

$$
4 \times 5 = 20\ \text{test cases}
$$

| Test case | `Duration` | `Locker size` | Expected Result |
| --- | --- | --- | --- |
| TC-001 | 15 | S | Success: Fee = 0 USD |
| TC-002 | 45 | L | Success: Fee = 2 USD (1 + 1) |
| TC-003 | 0 | S | Invalid: `Duration` < 1, Beep |
| TC-004 | 45 | Blank | Invalid: Missing locker size, Beep |
| TC-005 | 0 | Blank | Invalid: `Duration` < 1 & Missing size, Beep |
| TC-006 | 150 | K | Invalid: `Duration` > 120 & Invalid size, Beep |
| ... | ... | ... | ... |

Đối với bài toán Smart Locker System, kỹ thuật Weak Robust ECP là lựa chọn tối ưu nhất. Lý do bài toán có quy định cụ thể về các giá trị không hợp lệ (nhập ngoài khoảng thời gian, không chọn tủ hoặc nhập sai ký tự). Dùng Normal ECP sẽ bỏ sót các trường hợp kiểm thử lỗi, trong khi Strong Robust ECP sinh ra quá nhiều test case (20 test cases) dẫn đến tốn kém thời gian không cần thiết cho một hệ thống nhập liệu đơn giản.

### Smart Loan System

Một ứng dụng ngân hàng số cho phép khách hàng đăng ký khoản vay tín chấp trực tuyến. Hệ thống yêu cầu người dùng nhập 3 thông tin đầu vào chính để duyệt tự động:

| Data field | Description | Valid range |
| --- | --- | --- |
| `Credit Score` | Điểm tín dụng CIC của khách hàng | 300 ≤ `Credit Score` ≤ 850 |
| `Monthly Income` | Thu nhập hàng tháng (đơn vị: triệu VNĐ) | 10 ≤ `Monthly Income` ≤ 200 |
| `Employment Type` | Form hợp đồng lao động | Permanent (P), Contract (C), Freelance (F) |

Quy tắc xử lý và phê duyệt của hệ thống như sau:

1. Điều kiện về Điểm tín dụng (`Credit Score`):
- Từ 300 đến 599: Năng lực tín dụng yếu (Weak).
- Từ 600 đến 749: Năng lực tín dụng tốt (Good).
- Từ 750 đến 850: Năng lực tín dụng xuất sắc (Excellent).
- Nhỏ hơn 300 hoặc lớn hơn 850: Dữ liệu không hợp lệ.

2. Điều kiện về Thu nhập (`Monthly Income`):
- Từ 10 đến dưới 30 triệu: Thu nhập trung bình (Tier 1).
- Từ 30 đến 200 triệu: Thu nhập cao (Tier 2).
- Nhỏ hơn 10 triệu hoặc lớn hơn 200 triệu: Dữ liệu không hợp lệ.

3. Điều kiện về Loại hình lao động (`Employment Type`):
- P (Permanent - Dài hạn): Hợp lệ.
- C (Contract - Hợp đồng): Hợp lệ.
- F (Freelance - Tự do): Hệ thống từ chối cho vay trực tuyến (Không hỗ trợ duyệt tự động, yêu cầu làm việc trực tiếp tại quầy).
- Nếu để trống (Blank) hoặc nhập ký tự khác: Dữ liệu không hợp lệ.

4. Ràng buộc kết hợp (Logic phê duyệt khoản vay):
- Hồ sơ Duyệt thành công (Approved) khi cả 3 trường đều đúng định dạng, `Employment Type` là P hoặc C, đồng thời không rơi vào trường hợp (`Credit Score` thuộc nhóm Weak VÀ `Monthly Income` thuộc nhóm Tier 1).
- Hồ sơ Bị từ chối (Rejected) nếu nhập `Employment Type` là F, hoặc rơi vào trường hợp kết hợp lỗi (`Credit Score` Weak VÀ `Monthly Income` Tier 1).
- Hệ thống hiển thị Thông báo lỗi (Error) nếu có bất kỳ trường nào có dữ liệu không hợp lệ (out of range/invalid character/blank).

**Lời giải chi tiết**

Để thiết kế các tập test case ECP, trước tiên ta cần xác định các equivalence classes cho từng biến đầu vào bằng cách xây dựng bảng Phân tích các Lớp Tương Đương (Equivalence Classes):

| Variable | Equivalence class | Value | Type |
| --- | --- | --- | --- |
| class |  |  |  |
| `Credit Score` | EC1 | 300 ≤ `Credit Score` ≤ 599 | Valid: Weak |
| `Credit Score` | EC2 | 600 ≤ `Credit Score` ≤ 749 | Valid: Good |
| `Credit Score` | EC3 | 750 ≤ `Credit Score` ≤ 850 | Valid: Excellent |
| `Credit Score` | EC4 | `Credit Score` < 300 | Invalid |
| `Credit Score` | EC5 | `Credit Score` > 850 | Invalid |
| `Monthly Income` | EC6 | 10 ≤ `Monthly Income` < 30 | Valid: Tier 1 |
| `Monthly Income` | EC7 | 30 ≤ `Monthly Income` ≤ 200 | Valid: Tier 2 |
| `Monthly Income` | EC8 | `Monthly Income` < 10 | Invalid |
| `Monthly Income` | EC9 | `Monthly Income` > 200 | Invalid |
| `Employment Type` | EC10 | P | Valid: Permanent |
| class |  |  |  |
| `Employment Type` | EC11 | C | Valid: Contract |
| `Employment Type` | EC12 | F | Valid: Freelance (Logic Reject) |
| `Employment Type` | EC13 | Blank | Invalid: Missing |
| `Employment Type` | EC14 | K | Invalid: Other character |

Đối với Weak Normal ECP, ta chọn một đại diện từ mỗi lớp hợp lệ và đảm bảo mọi lớp hợp lệ đều xuất hiện ít nhất một lần: EC1–EC3, EC6–EC7, EC10–EC12. Số lượng test case: Biến `Credit Score` và `Employment Type` có số lớp hợp lệ lớn nhất (3 lớp), nên số lượng test case tối thiểu là 3.

| Test case | `Credit Score` | `Monthly Income` | `Employment Type` | Covered classes | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 500 | 20 | P | EC1, EC6, EC10 | Rejected: Weak + Tier 1 |
| TC-002 | 680 | 50 | C | EC2, EC7, EC11 | Approved |
| TC-003 | 800 | 50 | F | EC3, EC7, EC12 | Rejected: Freelance |

Đối với Weak Robust ECP, ta cần bao phủ tất cả các lớp (cả hợp lệ lẫn không hợp lệ) ít nhất một lần, tuân thủ nguyên tắc Single Fault Assumption (mỗi test case không hợp lệ chỉ vi phạm đúng 1 biến). Số lượng test case: 3 (Base Normal) + 2 (Invalid Credit) + 2 (Invalid Income) + 2 (Invalid Employment) = 9 test cases

| Test case | `Credit Score` | `Monthly Income` | `Employment Type` | Covered classes | Expected result |
| --- | --- | --- | --- | --- | --- |
| TC-001 | 500 | 20 | P | EC1, EC6, EC10 | Rejected: Weak + Tier 1 |
| TC-002 | 680 | 50 | C | EC2, EC7, EC11 | Approved |
| TC-003 | 800 | 50 | F | EC3, EC7, EC12 | Rejected: Freelance |
| TC-004 | 200 | 50 | P | EC4, EC7, EC10 | Error: `Credit Score` < 300 |
| TC-005 | 900 | 50 | C | EC5, EC7, EC11 | Error: `Credit Score` > 850 |
| TC-006 | 680 | 5 | P | EC2, EC8, EC10 | Error: Income < 10 |
| TC-007 | 680 | 250 | C | EC2, EC9, EC11 | Error: Income > 200 |
| TC-008 | 680 | 50 | Blank | EC2, EC7, EC13 | Error: Missing employment type |
| TC-009 | 680 | 50 | K | EC2, EC7, EC14 | Error: Invalid employment type |

Đối với Strong Normal ECP, ta kết hợp tất cả các lớp hợp lệ của 3 biến được tổ hợp đầy đủ với nhau. Số lượng test case:

$$
3_{\text{`Credit Score`}} \times 2_{\text{Income}} \times 3_{\text{Employment}} = 18\ \text{test cases}
$$

| Test case | `Credit Score` | `Monthly Income` | `Employment Type` | Expected result |
| --- | --- | --- | --- | --- |
| TC-001 | 500 | 20 | P | Rejected: Weak + Tier 1 |
| TC-002 | 500 | 20 | C | Rejected: Weak + Tier 1 |
| TC-003 | 500 | 20 | F | Rejected: Freelance & Weak + Tier 1 |
| TC-004 | 500 | 50 | P | Approved |
| TC-005 | 500 | 50 | C | Approved |
| TC-006 | 500 | 50 | F | Rejected: Freelance |
| TC-007 | 680 | 20 | P | Approved |
| TC-008 | 680 | 20 | C | Approved |
| TC-009 | 680 | 20 | F | Rejected: Freelance |
| TC-010 | 680 | 50 | P | Approved |
| TC-011 | 680 | 50 | C | Approved |
| TC-012 | 680 | 50 | F | Rejected: Freelance |
| TC-013 | 800 | 20 | P | Approved |
| TC-014 | 800 | 20 | C | Approved |
| TC-015 | 800 | 20 | F | Rejected: Freelance |
| TC-016 | 800 | 50 | P | Approved |
| TC-017 | 800 | 50 | C | Approved |
| TC-018 | 800 | 50 | F | Rejected: Freelance |

Đối với Strong Robust ECP, ta kết hợp tất cả các lớp hợp lệ và không hợp lệ của 3 biến được tổ hợp đầy đủ với nhau. Số lượng test case:

$$
5_{\text{`Credit Score`}} \times 4_{\text{Income}} \times 5_{\text{Employment}} = 100\ \text{test cases}
$$

| Test case | `Credit Score` | `Monthly Income` | `Employment Type` | Expected result |
| --- | --- | --- | --- | --- |
| TC-001 | 680 | 50 | P | Approved |
| TC-002 | 800 | 50 | F | Rejected: Freelance |
| TC-003 | 500 | 20 | C | Rejected: Weak + Tier 1 |
| TC-004 | 200 | 50 | P | Error: `Credit Score` < 300 |
| TC-005 | 680 | 5 | Blank | Error: Income < 10 & Missing employment type |
| TC-006 | 200 | 250 | K | Error: Credit < 300, Income > 200 & Invalid employment type |
| ... | ... | ... | ... | ... |

Đối với hệ thống này, Strong Normal ECP kết hợp với phần kiểm thử lỗi từ Weak Robust ECP (hoặc một phiên bản điều chỉnh của Weak Robust) là lựa chọn tối ưu nhất. Lý do: Kỹ thuật Weak Normal tỏ ra quá sơ sài vì hệ thống có chứa ràng buộc kết hợp nghiệp vụ quan trọng (`Credit Score` Weak VÀ Income Tier 1). Nếu chỉ dùng Weak Normal, ta có thể bỏ sót các nhánh logic quyết định phê duyệt. Trong khi đó, Strong Robust sinh ra tới 100 test cases, chứa quá nhiều trường hợp trùng lặp về thông báo lỗi không cần thiết.

## Decision Table Testing

### Online Library Borrowing Rules

Một thư viện trực tuyến cho phép người dùng mượn sách chỉ khi đáp ứng tất cả các điều kiện sau:
- Người dùng có tài khoản hoạt động (active account).
- Người dùng không có sách quá hạn (overdue books).
- Người dùng chưa vượt quá giới hạn mượn sách cho phép.

Các quy tắc bổ sung:
- Thành viên VIP có thể mượn tối đa 10 cuốn sách.
- Thành viên Non-VIP có thể mượn tối đa 5 cuốn sách.

Sử dụng Decision Table Testing, hãy xây dựng một Decision Table cho các quy tắc trên và thiết kế các test case tương ứng.
- Xác định các conditions và actions chính.
- Trình bày một decision table rút gọn (reduced decision table).
- Rút ra các test case từ decision table.
- Giải thích xem bài toán có chứa quy tắc vô lý/bất khả thi (impossible rule) nào không.

**Lời giải chi tiết**

Trước tiên, ta cần xác định các business conditions:
- C1: Tài khoản có đang hoạt động không?
- C2: Người dùng có sách quá hạn không?
- C3: Người dùng có phải là thành viên VIP không?
- C4: Người dùng đã đạt đến hoặc vượt quá giới hạn mượn sách chưa? Các actions là:
- A1: Cho phép mượn
- A2: Từ chối mượn
- A3: Hiển thị lý do từ chối Các quy tắc chính là:
- Nếu C1 = No, từ chối mượn.
- Nếu C2 = Yes, từ chối mượn.
- Nếu C4 = Yes, từ chối mượn.
- Chỉ khi C1 = Yes, C2 = No, và C4 = No, hệ thống mới cho phép mượn.
- C3 được dùng để xác định giới hạn là 5 hay 10, nhưng quyết định mượn sách cuối cùng đã được xác định bởi C4.

Từ các quy tắc trên, ta lập bảng Decision Table rút gọn:

| Rule | R1 | R2 | R3 | R4 |
| --- | --- | --- | --- | --- |
| C1. Account active? | N | Y | Y | Y |
| C2. Overdue books? | - | Y | N | N |
| C4. Exceeded limit? | - | - | Y | N |
| A1. Allow borrowing | N | N | N | Y |
| A2. Reject borrowing | Y | Y | Y | N |
| A3. Rejection reason | Account inactive | Overdue books exist | Borrowing limit exceeded | - |

Bảng rút gọn này có bốn quy tắc cốt lõi:
- R1: Từ chối vì tài khoản không hoạt động.
- R2: Từ chối vì người dùng có sách quá hạn.
- R3: Từ chối vì đã đạt hoặc vượt quá giới hạn mượn sách.
- R4: Cho phép mượn.

Thiết kế bảng test case:

| Test case | C1 | C2 | C3 | Current borrowed books | Limit | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| TC-001 | No | No | Non-VIP | 0 | 5 | Reject, show “account inactive” |
| TC-002 | Yes | Yes | Non-VIP | 2 | 5 | Reject, show “overdue books exist” |
| TC-003 | Yes | No | Non-VIP | 5 | 5 | Reject, show “borrowing limit exceeded” |
| TC-004 | Yes | No | VIP | 9 | 10 | Allow borrowing |

Bốn test case trên là đủ để bao phủ bốn quy tắc rút gọn.

Bởi vì C3 ảnh hưởng đến cách đánh giá C4, bộ test case thực tế cũng nên xác minh hai giới hạn mượn sách khác nhau:

| Test case | Member type | Current borrowed books | Expected result |
| --- | --- | --- | --- |
| TC-005 | Non-VIP | 4 | Allow borrowing |
| TC-006 | Non-VIP | 5 | Reject because the limit has been reached |
| TC-007 | VIP | 9 | Allow borrowing |
| TC-008 | VIP | 10 | Reject because the limit has been reached |

Như vậy, Reduced Decision Table chỉ cần 4 test case cốt lõi, nhưng một bộ test case thực tế đầy đủ hơn nên chứa 8 test case để xác minh chính xác cả hai chính sách giới hạn.

Về việc Impossible rule analysis, bài tập này không chứa impossible rule. Lý do là C1, C2, C3, và C4 có thể được coi là các điều kiện độc lập về mặt logic trong decision table. Không có cặp điều kiện nào mâu thuẫn trực tiếp với nhau. Một impossible rule xuất hiện khi hai hoặc nhiều điều kiện không thể cùng đúng tại một thời điểm do ràng buộc nghiệp vụ. Ví dụ: C1: Người đó là sinh viên. C2: Người đó là giảng viên. Nếu quy tắc nghiệp vụ nói rằng một người không thể vừa là sinh viên vừa là giảng viên cùng một lúc, thì kết hợp C1 = Yes và C2 = Yes sẽ là một impossible rule.
