// https://leetcode.com/problems/russian-doll-envelopes/solutions/2072493/rust-functional-style-with-fold/
impl Solution {
    pub fn max_envelopes(mut envelopes: Vec<Vec<i32>>) -> i32 {
        envelopes.sort_unstable_by(|wh1, wh2| wh1[0].cmp(&wh2[0]).then(wh2[1].cmp(&wh1[1])));
        envelopes
            .into_iter()
            .map(|wh| wh[1])
            .fold(vec![], |mut dp, num| {
                match dp.binary_search(&num) {
                    Err(i) if i == dp.len() => dp.push(num),
                    Err(i) => dp[i] = num,
                    _ => (),
                }
                dp
            })
            .len() as i32
    }
}