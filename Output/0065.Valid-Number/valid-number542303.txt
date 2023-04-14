// https://leetcode.com/problems/valid-number/solutions/542303/easy-to-read-rust-solution-0ms-2-1mb/
impl Solution {
    pub fn is_number(s: String) -> bool {
        let s: Vec<_> = s.trim().split('e').collect();
        match s[..] {
            [float] => is_float(float),
            [significand, exponent] => is_float(significand) && is_integer(exponent),
            _ => false,
        }
    }
}

fn is_float(s: &str) -> bool {
    may_have_sign_ahead_and(is_unsigned_float, s)
}


fn is_integer(s: &str) -> bool {
    may_have_sign_ahead_and(is_unsigned_integer, s)
}

fn may_have_sign_ahead_and(predicate: impl Fn(&str) -> bool, s: &str) -> bool {
    match s.chars().nth(0) {
        Some('+') | Some('-') => predicate(&s[1..]),
        _ => predicate(s),
    }
}

fn is_unsigned_integer(s: &str) -> bool {
    if s.len()==0 {
        false
    } else {
        is_unsigned_integer_or_empty(s)
    }
}

fn is_unsigned_integer_or_empty(s: &str) -> bool {
    for char in s.chars() {
        match char {
            '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9' => {},
            _ => { return false },
        }
    }
    true
}

fn is_unsigned_float(s: &str) -> bool {
    let s: Vec<_> = s.split('.').collect();
    match s[..] {
        [integer] => is_unsigned_integer(integer),
        [integer_part, factional_part] => is_unsigned_integer_or_empty(integer_part) && is_unsigned_integer_or_empty(factional_part) && (integer_part.len()!=0 || factional_part.len()!=0),
        _ => false,
    }
}