// https://leetcode.com/problems/candy/solutions/360041/simple-rust-solution-beats-100/
pub fn candy(ratings: Vec<i32>) -> i32 {
    let n = ratings.len();
    let mut allocation = vec![1; n];
    for i in 1..n {
        if ratings[i] > ratings[i - 1] {
            allocation[i] = allocation[i - 1] + 1;
        }
    }
    for i in (0..n - 1).rev() {
        if ratings[i] > ratings[i + 1] {
            allocation[i] = allocation[i].max(allocation[i + 1] + 1);
        }
    }
    allocation.iter().sum()
}