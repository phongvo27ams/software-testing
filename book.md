# Black Box Testing

## Boundary Value Analysis

### Exercise: Room Booking Validation

An university room booking system lets users register a room booking by entering the following data:

| Data field | Description | Valid range |
|---|---|---|
| `Duration` | Room usage duration in minutes | `30 <= Duration <= 180` |
| `Number of Students` | Number of participating students | `1 <= Number of Students <= 50` |

The system applies these validation rules:

- If `Duration` is less than 30 or greater than 180, the request must be rejected and an error message displayed.
- If `Number of Students` is less than 1 or greater than 50, the request must be rejected and an error message displayed.
- A booking request is accepted only when both fields are within their valid ranges.

Assume the following nominal values:

- The nominal value of `Duration` is 90 minutes.
- The nominal value of `Number of Students` is 25 students.

#### Question

Using Boundary Value Analysis (BVA), design test sets for the system above by applying the following four methods in order: Normal BVA, Robust BVA, Worst-case BVA, and Robust Worst-case BVA.

For each method:

- Explain how to calculate the number of generated test cases.
- Identify the test values selected for each variable.
- Present the test cases in table form.

:::tip
Start by listing the valid range and nominal value of each input variable.

- For **Normal BVA**, choose the boundary values and the values just inside the boundary, then vary one variable at a time while keeping the others at nominal values.
- For **Robust BVA**, add the values just outside each valid boundary so you can test both valid and invalid edge cases.
- For **Worst-case BVA**, take all combinations of the selected valid boundary values across all variables.
- For **Robust Worst-case BVA**, take all combinations of the valid, near-boundary, and out-of-range values across all variables.

A useful shortcut is to calculate the test case count first, then build the table row by row from the selected value sets.
:::

#### Sample Answer

To design BVA test sets, we first identify the valid ranges, the nominal values, and then derive boundary values for each input variable.

There are 2 input variables:

| Variable | Valid range | Nominal value |
|---|---|---:|
| `Duration` | 30 to 180 | 90 |
| `Number of Students` | 1 to 50 | 25 |

The system accepts the booking when both `Duration` and `Number of Students` are valid. If one or both variables are invalid, the system shows the corresponding error.

##### Normal BVA

Normal BVA checks valid boundary values and near-boundary valid values, changing only one variable at a time while keeping the other at nominal values.

For each variable, choose 5 values:

| Variable | Normal BVA values |
|---|---|
| `Duration` | 30, 31, 90, 179, 180 |
| `Number of Students` | 1, 2, 25, 49, 50 |

$$
4n + 1 = 4 \times 2 + 1 = 9 \text{ test cases}
$$

The test set is:

| Test case | Duration | Number of Students | Expected result |
|---|---:|---:|---|
| TC-001 | 90 | 25 | Accept booking |
| TC-002 | 30 | 25 | Accept booking |
| TC-003 | 31 | 25 | Accept booking |
| TC-004 | 179 | 25 | Accept booking |
| TC-005 | 180 | 25 | Accept booking |
| TC-006 | 90 | 1 | Accept booking |
| TC-007 | 90 | 2 | Accept booking |
| TC-008 | 90 | 49 | Accept booking |
| TC-009 | 90 | 50 | Accept booking |

##### Robust BVA

Robust BVA checks both valid values and invalid values just outside the boundaries.

| Variable | Robust BVA values |
|---|---|
| `Duration` | 29, 30, 31, 90, 179, 180, 181 |
| `Number of Students` | 0, 1, 2, 25, 49, 50, 51 |

$$
6n + 1 = 6 \times 2 + 1 = 13 \text{ test cases}
$$

The test set is:

| Test case | Duration | Number of Students | Expected result |
|---|---:|---:|---|
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

##### Worst-case BVA

Worst-case BVA uses the same valid boundary values as Normal BVA, but tests all combinations among the variables by taking the Cartesian product of the valid boundary values.

| Variable | Value set |
|---|---|
| `Duration` | 30, 31, 90, 179, 180 |
| `Number of Students` | 1, 2, 25, 49, 50 |

$$
5^n = 5^2 = 25 \text{ test cases}
$$

The test set is:

| Test case | Duration | Number of Students | Expected result |
|---|---:|---:|---|
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

##### Robust Worst-case BVA

Robust Worst-case BVA uses both valid and invalid values near the boundaries and tests all combinations by taking the Cartesian product of the boundary, near-boundary, and out-of-range values.

| Variable | Value set |
|---|---|
| `Duration` | 29, 30, 31, 90, 179, 180, 181 |
| `Number of Students` | 0, 1, 2, 25, 49, 50, 51 |

$$
7^n = 7^2 = 49 \text{ test cases}
$$

The full test set would contain all 49 combinations. A few representative rows are shown below:

| Test case | Duration | Number of Students | Expected result |
|---|---:|---:|---|
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
| ... | ... | ... | ... |
| TC-049 | 181 | 51 | Error: invalid `Duration` and `Number of Students` |

<!-- chapter -->

### Exercise: Seminar Registration System

A university academic seminar registration system allows users to enter the following information:

| Data field | Description | Valid range |
|---|---|---|
| `Age` | Age of the participant | `18 <= Age <= 65` |
| `Experience` | Years of research experience | `0 <= Experience <= 40` |
| `Registration Days Before Event` | Number of days before the seminar date that the user registers | `1 <= Registration Days Before Event <= 180` |
| `Number of Workshops` | Number of workshops the user wants to attend | `1 <= Number of Workshops <= 10` |

The system applies the following validation rules:

- If `Age` is less than 18 or greater than 65, the registration must be rejected and an error message displayed.
- If `Experience` is less than 0 or greater than 40, the registration must be rejected and an error message displayed.
- If `Registration Days Before Event` is less than 1 or greater than 180, the registration must be rejected and an error message displayed.
- If `Number of Workshops` is less than 1 or greater than 10, the registration must be rejected and an error message displayed.
- The registration is accepted only when all fields are within their valid ranges.

Assume the following nominal values:

- `Age = 30`
- `Experience = 10`
- `Registration Days Before Event = 90`
- `Number of Workshops = 5`

#### Question

Using Boundary Value Analysis (BVA), design test sets for the system above by applying the following four methods in order: Normal BVA, Robust BVA, Worst-case BVA, and Robust Worst-case BVA.

For each method:

- Explain how to calculate the number of generated test cases.
- Identify the test values selected for each variable.
- Present the test cases in table form.
- For Worst-case BVA and Robust Worst-case BVA, only present a few representative test cases.

:::tip
Start by listing the valid range and nominal value of each input variable.

- For **Normal BVA**, choose the boundary values and the values just inside the boundary, then vary one variable at a time while keeping the others at nominal values.
- For **Robust BVA**, add the values just outside each valid boundary so you can test both valid and invalid edge cases.
- For **Worst-case BVA**, take all combinations of the selected valid boundary values across all variables.
- For **Robust Worst-case BVA**, take all combinations of the valid, near-boundary, and out-of-range values across all variables.

A useful shortcut is to calculate the test case count first, then build the table row by row from the selected value sets.
:::

#### Sample Answer

To design BVA test sets, we first identify the valid ranges, the nominal values, and the boundary values for each input variable.

There are 4 input variables:

| Variable | Valid range | Nominal value |
|---|---|---:|
| `Age` | 18 to 65 | 30 |
| `Experience` | 0 to 40 | 10 |
| `Registration Days Before Event` | 1 to 180 | 90 |
| `Number of Workshops` | 1 to 10 | 5 |

The system accepts the registration only when all variables are valid. If one or more variables are invalid, the system displays the corresponding error.

##### Normal BVA

Normal BVA checks valid boundary values and near-boundary valid values. Only one variable is changed at a time while the other variables remain at nominal values.

For each variable, choose 5 values:

| Variable | Normal BVA values |
|---|---|
| `Age` | 18, 19, 30, 64, 65 |
| `Experience` | 0, 1, 10, 39, 40 |
| `Registration Days Before Event` | 1, 2, 90, 179, 180 |
| `Number of Workshops` | 1, 2, 5, 9, 10 |

$$
4n + 1 = 4 \times 4 + 1 = 17 \text{ test cases}
$$

The test set is:

| Test case | Age | Experience | Registration Days | Workshops | Expected result |
|---|---:|---:|---:|---:|---|
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

##### Robust BVA

Robust BVA checks both valid values and invalid values just outside the boundaries. Only one variable is changed at a time while the others remain at nominal values.

| Variable | Robust BVA values |
|---|---|
| `Age` | 17, 18, 19, 30, 64, 65, 66 |
| `Experience` | -1, 0, 1, 10, 39, 40, 41 |
| `Registration Days Before Event` | 0, 1, 2, 90, 179, 180, 181 |
| `Number of Workshops` | 0, 1, 2, 5, 9, 10, 11 |

$$
6n + 1 = 6 \times 4 + 1 = 25 \text{ test cases}
$$

The test set is:

| Test case | Age | Experience | Registration Days | Workshops | Expected result |
|---|---:|---:|---:|---:|---|
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

##### Worst-case BVA

Worst-case BVA uses the same valid boundary values as Normal BVA, but tests all combinations among the variables by taking the Cartesian product of the valid boundary values.

| Variable | Value set |
|---|---|
| `Age` | 18, 19, 30, 64, 65 |
| `Experience` | 0, 1, 10, 39, 40 |
| `Registration Days Before Event` | 1, 2, 90, 179, 180 |
| `Number of Workshops` | 1, 2, 5, 9, 10 |

$$
5^n = 5^4 = 625 \text{ test cases}
$$

Because the number of combinations is large, only a few representative test cases are shown:

| Test case | Age | Experience | Registration Days | Workshops | Expected result |
|---|---:|---:|---:|---:|---|
| TC-001 | 18 | 0 | 1 | 1 | Accept registration |
| TC-002 | 18 | 0 | 1 | 2 | Accept registration |
| TC-003 | 18 | 0 | 1 | 5 | Accept registration |
| TC-004 | 30 | 10 | 90 | 5 | Accept registration |
| TC-005 | 64 | 39 | 179 | 9 | Accept registration |
| TC-006 | 65 | 40 | 180 | 10 | Accept registration |

##### Robust Worst-case BVA

Robust Worst-case BVA uses both valid values and invalid values near the boundaries, and it tests all combinations among the variables.

| Variable | Value set |
|---|---|
| `Age` | 17, 18, 19, 30, 64, 65, 66 |
| `Experience` | -1, 0, 1, 10, 39, 40, 41 |
| `Registration Days Before Event` | 0, 1, 2, 90, 179, 180, 181 |
| `Number of Workshops` | 0, 1, 2, 5, 9, 10, 11 |

$$
7^n = 7^4 = 2401 \text{ test cases}
$$

Because the number of combinations is very large, only a few representative test cases are shown:

| Test case | Age | Experience | Registration Days | Workshops | Expected result |
|---|---:|---:|---:|---:|---|
| TC-001 | 17 | -1 | 0 | 0 | Error: invalid `Age`, `Experience`, `Registration Days Before Event`, `Number of Workshops` |
| TC-002 | 17 | 10 | 90 | 5 | Error: invalid `Age` |
| TC-003 | 30 | -1 | 90 | 5 | Error: invalid `Experience` |
| TC-004 | 30 | 10 | 0 | 5 | Error: invalid `Registration Days Before Event` |
| TC-005 | 30 | 10 | 90 | 0 | Error: invalid `Number of Workshops` |
| TC-006 | 18 | 0 | 1 | 1 | Accept registration |
| TC-007 | 65 | 40 | 180 | 10 | Accept registration |
| TC-008 | 66 | 41 | 181 | 11 | Error: invalid `Age`, `Experience`, `Registration Days Before Event`, `Number of Workshops` |

<!-- chapter -->

## Equivalence Partitioning

### Exercise: Movie Ticket Booking

A movie ticket booking system allows customers to reserve tickets by entering two pieces of information:

| Data field | Description | Valid values |
|---|---|---|
| `Age` | The age of the customer | `Child`, `Adult`, `Senior` |
| `Seat type` | The type of seat selected by the customer | `S`, `P` |

The system must validate the inputs according to the following rules:

- Age group:
  - Customers aged from `6` to `12` are classified as `Child`.
  - Customers aged from `13` to `59` are classified as `Adult`.
  - Customers aged from `60` to `80` are classified as `Senior`.
  - Any age less than `6` is invalid, or greater than `80` is invalid.
- Seat type:
  - `Standard` seats are entered as `S`.
  - `Premium` seats are entered as `P`.
  - If no seat type is selected, the system must display an error message.
  - If the user enters any value other than `S` or `P`, the system must display an error message.
- The booking is accepted only when both `Age` and `Seat type` are valid.

#### Question

Using Equivalence Class Partitioning (ECP), design test sets for the system above by applying the following four techniques in order: Weak Normal ECP, Strong Normal ECP, Weak Robust ECP, and Strong Robust ECP.

For each technique:

- Explain how to determine the number of generated test cases.
- Identify the equivalence classes used for each input.
- Present the test cases in table form.
- For Strong Robust ECP, only present a few representative test cases.

:::tip
Start by separating the input domain into valid and invalid equivalence classes.

- For **Weak Normal ECP**, select one representative from each valid class and make sure every valid class appears at least once.
- For **Weak Robust ECP**, include both valid and invalid classes, but still only require each class to appear at least once.
- For **Strong Normal ECP**, combine all valid classes across all inputs so that every valid class is paired with every other valid class.
- For **Strong Robust ECP**, combine all valid and invalid classes across all inputs, which produces the largest set.

A practical way to solve the question is to list the classes first, then decide whether the technique needs one representative per class or every possible combination.
:::

#### Sample Answer

To design ECP test sets, we first identify the equivalence classes for each input variable:

| Variable | Equivalence classe | Value | Type |
|---|---|---|---|
| Age group | EC1 | 6-12 | Valid: `Child` |
| Age group | EC2 | 13-59 | Valid: `Adult` |
| Age group | EC3 | 60-80 | Valid: `Senior` |
| Age group | EC4 | < 6 | Invalid |
| Age group | EC5 | > 80 | Invalid |
| Seat type | EC6 | S | Valid: `Standard` |
| Seat type | EC7 | P | Valid: `Premium` |
| Seat type | EC8 | Blank | Invalid |
| Seat type | EC9 | X | Invalid |

The system accepts the booking only when both inputs belong to valid equivalence classes.

##### Weak Normal ECP

Weak means we do not need to test every combination. Normal means we use only valid classes.

We need to cover all valid classes at least once: EC1, EC2, EC3, EC6, EC7. One suitable test set is:

| Test case | Age group | Seat type | Covered classes |
|---|---:|---:|---|
| TC-001 | 8 | S | EC1, EC6 |
| TC-002 | 25 | P | EC2, EC7 |
| TC-003 | 65 | S | EC3, EC6 |

Weak Normal ECP requires 3 test cases in this example.

##### Weak Robust ECP

Weak means we do not need to test every combination. Robust means we include both valid and invalid classes.

We need to cover all classes at least once. One suitable test set is:

| Test case | Age group | Seat type | Covered classes |
|---|---:|---:|---|
| TC-001 | 8 | S | EC1, EC6 |
| TC-002 | 25 | P | EC2, EC7 |
| TC-003 | 65 | S | EC3, EC6 |
| TC-004 | 5 | S | EC4, EC6 |
| TC-005 | 81 | P | EC5, EC7 |
| TC-006 | 25 | Blank | EC2, EC8 |
| TC-007 | 25 | X | EC2, EC9 |

Weak Robust ECP requires 7 test cases in this example.

##### Strong Normal ECP

Strong means we test all combinations. Normal still means we use only valid classes.

There are 3 valid age classes and 2 valid seat classes, so the number of test cases is:

$$
3 \times 2 = 6 \text{ test cases}
$$

The test set is:

| Test case | Age group | Seat type | Expected result |
|---|---:|---:|---|
| TC-001 | 8 | S | Valid: Child, Standard |
| TC-002 | 8 | P | Valid: Child, Premium |
| TC-003 | 25 | S | Valid: Adult, Standard |
| TC-004 | 25 | P | Valid: Adult, Premium |
| TC-005 | 65 | S | Valid: Senior, Standard |
| TC-006 | 65 | P | Valid: Senior, Premium |

##### Strong Robust ECP

Strong means we test all combinations. Robust means we include both valid and invalid classes.

There are 5 age classes and 4 seat classes, so the number of test cases is:

$$
5 \times 4 = 20 \text{ test cases}
$$

The full set is large, so only a few representative test cases are shown:

| Test case | Age group | Seat type | Expected result |
|---|---:|---:|---|
| TC-001 | 5 | S | Invalid: Under 6, Standard |
| TC-002 | 5 | P | Invalid: Under 6, Premium |
| TC-003 | 5 | Blank | Invalid: Under 6, Missing seat type |
| TC-004 | 5 | X | Invalid: Under 6, Invalid seat type |
| TC-005 | 8 | S | Valid: Child, Standard |
| TC-006 | 8 | P | Valid: Child, Premium |
| TC-007 | 8 | Blank | Invalid: Child, Missing seat type |
| TC-008 | 8 | X | Invalid: Child, Invalid seat type |
| TC-009 | 25 | S | Valid: Adult, Standard |
| TC-010 | 25 | P | Valid: Adult, Premium |
| TC-011 | 25 | Blank | Invalid: Adult, Missing seat type |
| TC-012 | 25 | X | Invalid: Adult, Invalid seat type |
| TC-013 | 65 | S | Valid: Senior, Standard |
| TC-014 | 65 | P | Valid: Senior, Premium |
| TC-015 | 65 | Blank | Invalid: Senior, Missing seat type |
| TC-016 | 65 | X | Invalid: Senior, Invalid seat type |
| TC-017 | 81 | S | Invalid: Over 80, Standard |
| TC-018 | 81 | P | Invalid: Over 80, Premium |
| TC-019 | 81 | Blank | Invalid: Over 80, Missing seat type |
| TC-020 | 81 | X | Invalid: Over 80, Invalid seat type |

<!-- chapter -->

## Decision Table Testing

### Exercise: Online Library Borrowing Rules

An online library system allows a user to borrow a book only when all of the following conditions are satisfied:

- The user has an active account.
- The user has no overdue books.
- The user has not exceeded the allowed borrowing limit.

Additional rules:

- A `VIP` member may borrow up to `10` books.
- A `Non-VIP` member may borrow up to `5` books.

#### Question

Using Decision Table Testing, build a decision table for the rules above and design the corresponding test cases.

Your answer should:

- Identify the main conditions and actions.
- Present a reduced decision table.
- Derive the test cases from the decision table.
- Explain whether the problem contains any impossible rule.

:::tip
Separate the problem into two parts:

- First, identify the business conditions that directly affect the final decision.
- Then, decide whether some inputs are only intermediate logic.

In this exercise, the member type does affect the borrowing limit, but the final borrow decision is already reflected by the condition "current borrowed books exceeded the limit or not". That is why the reduced decision table can stay compact while the test cases still verify both VIP and Non-VIP scenarios.
:::

#### Sample Answer

We first identify the business conditions:

- `C1`: Is the account active?
- `C2`: Does the user have overdue books?
- `C3`: Is the user a VIP member?
- `C4`: Has the user already reached or exceeded the borrowing limit?

The actions are:

- `A1`: Allow borrowing
- `A2`: Reject borrowing
- `A3`: Display the rejection reason

The main rules are:

- If `C1 = No`, reject borrowing.
- If `C2 = Yes`, reject borrowing.
- If `C4 = Yes`, reject borrowing.
- Only when `C1 = Yes`, `C2 = No`, and `C4 = No`, the system allows borrowing.
- `C3` is used to determine whether the limit is `5` or `10`, but the final borrow decision is already captured by `C4`.

##### Reduced decision table

| Rule | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| C1. Account active? | N | Y | Y | Y |
| C2. Overdue books? | - | Y | N | N |
| C4. Exceeded limit? | - | - | Y | N |
| A1. Allow borrowing | N | N | N | Y |
| A2. Reject borrowing | Y | Y | Y | N |
| A3. Rejection reason | Account inactive | Overdue books exist | Borrowing limit exceeded | - |

This reduced table has four core rules:

- `R1`: Reject because the account is inactive.
- `R2`: Reject because the user has overdue books.
- `R3`: Reject because the borrowing limit has been reached or exceeded.
- `R4`: Allow borrowing.

##### Test cases derived from the decision table

| Test case | C1 | C2 | C3 | Current borrowed books | Limit | Expected result |
|---|---|---|---|---:|---:|---|
| TC-001 | No | No | Non-VIP | 0 | 5 | Reject, show "account inactive" |
| TC-002 | Yes | Yes | Non-VIP | 2 | 5 | Reject, show "overdue books exist" |
| TC-003 | Yes | No | Non-VIP | 5 | 5 | Reject, show "borrowing limit exceeded" |
| TC-004 | Yes | No | VIP | 9 | 10 | Allow borrowing |

The four test cases above are enough to cover the four reduced rules.

##### Additional tests for VIP and Non-VIP limits

Because `C3` affects how `C4` is evaluated, the practical test set should also verify the two different borrowing limits:

| Test case | Member type | Current borrowed books | Expected result |
|---|---|---:|---|
| TC-005 | Non-VIP | 4 | Allow borrowing |
| TC-006 | Non-VIP | 5 | Reject because the limit has been reached |
| TC-007 | VIP | 9 | Allow borrowing |
| TC-008 | VIP | 10 | Reject because the limit has been reached |

So, the reduced decision table needs only `4` core test cases, but a more complete practical test suite should contain `8` test cases to verify both limit policies correctly.

##### Impossible rule analysis

This exercise does **not** contain an impossible rule.

The reason is that `C1`, `C2`, `C3`, and `C4` can be treated as logically independent conditions in the decision table. There is no pair of conditions that directly contradicts each other.

An impossible rule appears when two or more conditions cannot be true at the same time because of a business constraint. For example:

- `C1`: The person is a student.
- `C2`: The person is a lecturer.

If the business rule says that one person cannot be both a student and a lecturer at the same time, then the combination `C1 = Yes` and `C2 = Yes` would be an impossible rule.
