// https://leetcode.com/problems/permutation-sequence/solutions/2228799/rust-iterative-mod-and-subtract-pattern-o-n-2/
impl Solution {
    pub fn get_permutation(n: i32, k: i32) -> String {
        let mut perm = vec![1];
        let mut tot = 1;
        for i in 1..n {
            tot *= i;
            perm.push(tot);
        }
        let mut k = k-1;
        let mut ans = String::new();
        let mut arr: Vec<i32> = (1..=n).collect();
        
        for _ in 0..n {
            let fac = perm.pop().unwrap_or(0);
            let mut ai: usize = 0;
            if k >= fac {
                ai = (k/fac) as usize;
                k -= ai as i32 * fac;
            }
            let d = arr.remove(ai);
            
            // let c = d.to_string();
            // ans.push_str(&c);
            let c = char::from_digit(d as u32, 10).unwrap_or('0');
            ans.push(c);
        }
        ans
    }
}