// https://leetcode.com/problems/valid-permutations-for-di-sequence/solutions/494725/rust-0ms-2-1mb-100/
// translated from https://leetcode.com/problems/valid-permutations-for-di-sequence/discuss/168278/C%2B%2BJavaPython-DP-Solution-O(N2)
pub fn num_perms_di_sequence(s: String) -> i32 {
    const MOD: i32 = 1_000_000_007;
    let n = s.len();
    let mut dp = vec![1; n + 1];
    let mut dp2 = vec![0; n];
//    println!("{:?}", dp);
    for i in 0..n {
        if s[i..].chars().next().unwrap() == 'I' {
            let mut cur = 0;
            for j in 0..n - i
            {
                cur = (cur + dp[j]) % MOD;
                dp2[j] = cur;
            }
        } else {
            let mut cur = 0;
            for j in (0..n - i).rev() {
                cur = (cur + dp[j + 1]) % MOD;
                dp2[j] = cur;
            }
        }
        dp[..n].copy_from_slice(&dp2[..n]);
//        println!("{:?}", dp);
    }
    dp[0]
}
