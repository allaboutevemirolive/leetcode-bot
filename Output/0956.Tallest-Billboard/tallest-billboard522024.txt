// https://leetcode.com/problems/tallest-billboard/solutions/522024/rust-solutions-4-ms/
impl Solution {
    pub fn tallest_billboard(rods: Vec<i32>) -> i32 {
        let _sum: i32 = rods.iter().sum();
        let mut dp: Vec<i32> = vec![-1; _sum as usize + 1];
        dp[0] = 0; 
        
        for r in &rods{
            let cur = dp.to_vec(); 
            for i in 0.._sum {
                if cur[i as usize] == -1 { continue; }
                if i + r <= _sum { dp[(r + i) as usize] = std::cmp::max(dp[(r+i) as usize], cur[i as usize]); }
                dp[(r-i).abs() as usize] = std::cmp::max(dp[(r-i).abs() as usize], cur[i as usize] + std::cmp::min(i, *r));
            }
        }
        dp[0]
    }
}