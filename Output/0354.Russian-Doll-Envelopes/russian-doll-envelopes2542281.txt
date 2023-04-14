// https://leetcode.com/problems/russian-doll-envelopes/solutions/2542281/rust-o-nlogn-solution/
impl Solution {
    pub fn max_envelopes(mut envelopes: Vec<Vec<i32>>) -> i32 {
        envelopes.sort_unstable_by(|lhs, rhs| lhs[0].cmp(&rhs[0]).then(rhs[1].cmp(&lhs[1])));
        
        let mut piles = vec![];
        
        for envelope in &envelopes {
            let idx = piles.binary_search(&envelope[1]).unwrap_or_else(|e| e);
            if idx == piles.len() {
                piles.push(envelope[1]);
            } else {
                piles[idx] = envelope[1];
            }
        }
        piles.len() as i32
    }
}