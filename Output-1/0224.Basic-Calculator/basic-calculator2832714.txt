// https://leetcode.com/problems/basic-calculator/solutions/2832714/rust-stack-recursion/
impl Solution {
    pub fn calculate(s: String) -> i32 {
        let exp: Vec<char> = s.chars().collect();
        
        Self::calc(&exp, 0).0
    }
    
    fn calc(s: &Vec<char>, start: usize) -> (i32, usize) {
        let mut stack = Vec::new();
        
        let mut update = |op: char, n: i32| {
            match op {
                '+' => stack.push(n),
                '-' => stack.push(-n),
                '*' => {
                    let prev = stack.pop().unwrap();
                    stack.push(prev * n)
                },
                '/' => {
                    let prev = stack.pop().unwrap();
                    stack.push(prev / n)
                },
                _ => return,
            }
        };
        
        let (mut num, mut sign) = (0i32, '+');
        let mut i = start;
        while i < s.len() {
            let ch = s[i];
            if ch.is_numeric() {
                num = num * 10 + ch.to_digit(10).unwrap() as i32;
            } else if ch == '+' || ch == '-' || ch == '*' || ch == '/' {
                update(sign, num);
                num = 0;
                sign = ch;
            } else if ch == '(' {
                let (paranRes, j) = Self::calc(s, i+1);
                num = paranRes;
                i = j;
            } else if ch == ')' {
                update(sign, num);
                return (stack.iter().sum(), i);
            }
            i += 1;
        }
        update(sign, num);
        (stack.iter().sum(), stack.len())
    }
}