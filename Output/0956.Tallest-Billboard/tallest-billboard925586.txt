// https://leetcode.com/problems/tallest-billboard/solutions/925586/rust-dp-solution-in-o-ns-time-and-o-s-space-4ms-2-1-mb/
impl Solution {
    pub fn tallest_billboard(rods: Vec<i32>) -> i32 {
        let sum: usize = rods.iter().map(|&x| x as usize).sum();
        let mut dp = vec![0; sum + 1];
        dp[0] = 1;

        for rod in rods {
            let mut new_dp = dp.clone();

            for difference in 0..=sum {
                if dp[difference] == 0 {
                    continue;
                }

                let bigger = dp[difference];
                let smaller = bigger - difference;

                new_dp[difference] = new_dp[difference].max(dp[difference]);
                new_dp[difference + rod as usize] =
                    new_dp[difference + rod as usize].max(dp[difference] + rod as usize);

                if difference >= rod as usize {
                    new_dp[difference - rod as usize] =
                        new_dp[difference - rod as usize].max(dp[difference]);
                } else {
                    new_dp[rod as usize - difference] =
                        new_dp[rod as usize - difference].max(smaller + rod as usize);
                }
            }

            dp = new_dp;
        }

        dp[0] as i32 - 1
    }
}