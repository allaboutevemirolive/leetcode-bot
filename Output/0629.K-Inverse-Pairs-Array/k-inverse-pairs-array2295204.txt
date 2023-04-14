// https://leetcode.com/problems/k-inverse-pairs-array/solutions/2295204/rust-dp-o-n-k-time-o-k-space/
impl Solution {
    const MOD: i32 = 1_000_000_007;
    
    pub fn k_inverse_pairs(n: i32, k: i32) -> i32 {
        let n = n as usize;
        let k = k as usize;
        let mut dp = vec![0i32; k + 1];
        
        for i in 1..=n {
            let mut temp = vec![0i32; k + 1];
            temp[0] = 1;
            
            for j in 1..=k {
                let val = (dp[j] + Self::MOD - dp.get(j - i).unwrap_or(&0)) % Self::MOD;
                temp[j] = (temp[j - 1] + val) % Self::MOD;
            }
            dp = temp;
        }
        
        (dp[k] + Self::MOD - dp.get(k - 1).unwrap_or(&0)) % Self::MOD
    }
}