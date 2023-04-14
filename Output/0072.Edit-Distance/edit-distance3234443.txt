// https://leetcode.com/problems/edit-distance/solutions/3234443/rust-dp-tabulation-functional-without-for-loops-100-faster/
//ok i am sought of using for loops but not the traditional ones ;)
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        if word1 == word2 {
            return 0;
        }
        let w1 = word1.len();
        let w2 = word2.len();
        if word1.is_empty() || word2.is_empty() {
            return (w1 + w2) as i32;
        }
        let mut dp = vec![vec![0; w1 + 1]; w2 + 1];
        
        dp[0]
            .iter_mut()
            .enumerate()
            .for_each(|(i, el)| *el = i as i32);
        dp.iter_mut()
            .enumerate()
            .for_each(|(i, el)| el[0] = i as i32);

        word2.char_indices().for_each(|(i, c1)| {
            word1.char_indices().for_each(|(j, c2)| {
                if c1 == c2 {
                    dp[i + 1][j + 1] = dp[i][j];
                } else {
                    dp[i + 1][j + 1] = i32::min(dp[i][j], i32::min(dp[i][j + 1], dp[i + 1][j])) + 1;
                }
            })
        });
        dp[w2][w1]
    }
}