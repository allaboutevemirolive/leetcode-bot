// https://leetcode.com/problems/valid-number/solutions/1138533/rust-solution-with-peekable-iterators/
use std::iter::Peekable;

impl Solution {
    pub fn is_number(s: String) -> bool {
        let mut iterator = s.chars().peekable();
        let mut it = &mut iterator;

        
        // Valid number has a structure:
        //
        // 0. Beginning of string
        // 1. Optional sign
        // 2. Optional digits (first)
        // 3. Optional dot
        // 4. Optional digits (second)
        // 5. Optional exponent
        // 5.a  Optional sign
        // 5.b  Digits
        // 6. End of string
        // Additional constraint: #2 and #4 cannot be both optional
        
        read_sign(it);
        
        let has_int_first = read_int(it);
        
        let has_dot = read_dot(it);
        let mut has_int_second = false;
        
        if has_dot {
            has_int_second = read_int(it);
        }
        
        if !has_int_first  && !has_int_second {
            // we have a dot, but not digits on left or right side, like "+.E123"
            return false;
        }

        if read_exp(it) {
            read_sign(it);
            
            if !read_int(it) {
                // There is "E" but no following integer
                return false;
            }
        }
        
        if it.peek().is_some() {
            // There are extra invalid characters left in the end of string,
            // it's not a number
            return false;
        }
        
        return true;
    }
}

fn read_sign<I: Iterator<Item = char>>(it: &mut Peekable<I>) -> bool {
    read_char(it, '+') || read_char(it, '-')
}

fn read_dot<I: Iterator<Item = char>>(it: &mut Peekable<I>) -> bool {
    read_char(it, '.')
}

fn read_exp<I: Iterator<Item = char>>(it: &mut Peekable<I>) -> bool {
    read_char(it, 'e') || read_char(it, 'E')
}

fn read_char<I: Iterator<Item = char>>(it: &mut Peekable<I>, c: char) -> bool {
    if it.peek() == Some(&c) {
        it.next();
        true
    } else {
        false
    }
}

fn read_int<I: Iterator<Item = char>>(it: &mut Peekable<I>) -> bool {
    let mut found_int = false;

    while it.peek().map(|c| c.is_digit(10)) == Some(true) {
        it.next();
        found_int = true;
    }
    
    found_int
}