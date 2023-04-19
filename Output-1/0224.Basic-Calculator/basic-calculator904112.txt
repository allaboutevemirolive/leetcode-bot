// https://leetcode.com/problems/basic-calculator/solutions/904112/rust-translated-0ms-100/
impl Solution {
    pub fn calculate(s: String) -> i32 {
        let mut ans = 0;
        let mut sign = 1;
        let mut num = 0;
        let mut stack = Vec::<i32>::new();
        stack.push(sign);
        for ch in s.chars() {
            match ch {
                '(' => {
                    stack.push(sign);
                }
                ')' => {
                    stack.pop();
                }
                '+' | '-' => {
                    ans += sign * num;
                    sign = *stack.last().unwrap() * if ch == '+' { 1 } else { -1 };
                    num = 0;
                }
                '0'..='9' => {
                    num = num * 10 + (ch as u8 - b'0') as i32;
                }
                _ => {}
            }
        }
        ans += sign * num;
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate() {
        assert_eq!(Solution::calculate("1 + 1".to_owned()), 2);
    }

    #[test]
    fn test_calculate_02() {
        assert_eq!(Solution::calculate(" 2-1 + 2 ".to_owned()), 3);
    }

    #[test]
    fn test_calculate_03() {
        assert_eq!(Solution::calculate("(1+(4+5+2)-3)+(6+8)".to_owned()), 23);
    }
}