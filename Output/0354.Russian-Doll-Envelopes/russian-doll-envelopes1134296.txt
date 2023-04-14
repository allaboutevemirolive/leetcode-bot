// https://leetcode.com/problems/russian-doll-envelopes/solutions/1134296/rust-solution/
impl Solution {
    pub fn max_envelopes(mut envelopes: Vec<Vec<i32>>) -> i32 {
        envelopes.sort_by(|x, y| match x[0].cmp(&y[0]) {
            std::cmp::Ordering::Equal => y[1].cmp(&x[1]),
            a => a,
        });
        let heights: Vec<i32> = envelopes.into_iter().map(|a| a[1]).collect();
        Self::length_of_lis(heights) as i32
    }

    pub fn length_of_lis(nums: Vec<i32>) -> i32 {
        let mut piles: Vec<i32> = vec![];
        for num in nums {
            if let Err(i) = piles.binary_search(&num) {
                if i < piles.len() {
                    piles[i] = num;
                } else {
                    piles.push(num);
                }
            }
        }
        piles.len() as i32
    }
}