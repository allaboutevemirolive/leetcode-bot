// https://leetcode.com/problems/candy/solutions/3021836/rust-solution-3ms-2-3-mb/
impl Solution {
    pub fn candy(ratings: Vec<i32>) -> i32 {
        let mut candies: Vec<i32> = vec![1; ratings.len()];

        for i in 1..ratings.len() {
            if ratings[i] > ratings[i - 1] {
                candies[i] = candies[i - 1] + 1;
            }
        }

        for i in (0..(ratings.len() - 1)).rev() {
            if ratings[i] > ratings[i + 1] && candies[i] <= candies[i + 1] {
                candies[i] = candies[i + 1] + 1;
            }
        }

        let sum: i32 = candies.iter().sum();
        sum
    }
}
