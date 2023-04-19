// https://leetcode.com/problems/valid-number/solutions/1532093/rust-0ms/
enum Status{
    Valid(fn(char) -> Status)
    , ValidNotLast(fn(char) -> Status)
    , Invalid
}

impl Solution {
    pub fn valid_init_sign(c: char) -> Status {
        match c {
            '+'|'-' => return Status::Valid(Solution::valid_after_init_sign),
            '0'..='9' => return Status::Valid(Solution::valid_before_dot),
            '.' => return Status::ValidNotLast(Solution::valid_after_init_dot),
            _ => return Status::Invalid
        }
    }

    pub fn valid_after_init_sign(c: char) -> Status {
        match c {
            '0'..='9' => return Status::Valid(Solution::valid_before_dot),
            '.' => return Status::ValidNotLast(Solution::valid_after_init_dot),
            _ => return Status::Invalid
        }
    }

    pub fn valid_before_dot(c: char) -> Status {
        match c {
            '0'..='9' => return Status::Valid(Solution::valid_before_dot),
            '.' => return Status::Valid(Solution::valid_after_dot),
            'e'|'E' => return Status::ValidNotLast(Solution::valid_sign_after_e),
            _ => return Status::Invalid
        }
    }
    
    pub fn valid_after_init_dot(c: char) -> Status {
        match c {
            '0'..='9' => return Status::Valid(Solution::valid_after_dot),
            _ => return Status::Invalid
        }
    }

    pub fn valid_after_dot(c: char) -> Status {
        match c {
            '0'..='9' => return Status::Valid(Solution::valid_after_dot),
            'e'|'E' => return Status::ValidNotLast(Solution::valid_sign_after_e),
            _ => return Status::Invalid
        }
    }

    pub fn valid_sign_after_e(c: char) -> Status {
        match c {
            '+'|'-' => return Status::ValidNotLast(Solution::valid_int_after_e),
            '0'..='9' => return Status::Valid(Solution::valid_int_after_e),
            _ => return Status::Invalid
        }
    }

    pub fn valid_int_after_e(c: char) -> Status {
        match c {
            '0'..='9' => return Status::Valid(Solution::valid_int_after_e),
            _ => return Status::Invalid
        }
    }

    pub fn is_number(s: String) -> bool {
        let mut state = Status::Valid(Solution::valid_init_sign);
        for c in s.chars() {
            match state {
                Status::Valid(validator) | Status::ValidNotLast(validator) => state = validator(c),
                Status::Invalid => return false
            }
        }
        match state {
            Status::Valid(_) => true,
            _ => false
        }
    }
}