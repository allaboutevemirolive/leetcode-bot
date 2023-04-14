// https://leetcode.com/problems/longest-valid-parentheses/solutions/2393308/rust-0ms-2-2mb/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let mut ans = Vec::with_capacity(s.len() + 2);
        ans.push(0);
        let mut left = 0;
        for i in 0..s.len() {
            if &s[i..i+1] == "(" {
                ans.push(0);
                left += 1;
            }else if left > 0 {
                left -= 1;
                let a = ans.pop().unwrap() + 2;
                let ind = ans.len() - 1;
                if ans[ind] < 0 {
                    ans.push(a);
                }else{
                    ans[ind] += a;
                }
            }else{
                let ind = ans.len() - 1;
                if ans[ind] < 0 {
                    ans[ind] -= 1;
                }else{
                    ans.push(-1);
                }
            }
        } 
        ans.into_iter().max().unwrap()         
    }
}