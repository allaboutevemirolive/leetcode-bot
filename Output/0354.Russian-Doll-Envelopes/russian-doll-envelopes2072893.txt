// https://leetcode.com/problems/russian-doll-envelopes/solutions/2072893/rust-sorting-binary-search-dp/
impl Solution {
    pub fn max_envelopes(mut envelopes: Vec<Vec<i32>>) -> i32 {
        envelopes.sort_unstable_by_key(|e| (e[0], -e[1]));
        let mut dp: Vec<Vec<i32>> = Vec::new();
        for en in envelopes.into_iter() {
            if let Err(i) = dp.binary_search_by_key(&en[1], |e| e[1]) {
                if i == dp.len() {
                    dp.push(en);
                }
                else {
                    dp[i] = en;
                }
            }
        }
        dp.len() as i32
    }
}