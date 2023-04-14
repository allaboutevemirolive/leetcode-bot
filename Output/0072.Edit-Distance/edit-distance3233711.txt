// https://leetcode.com/problems/edit-distance/solutions/3233711/rust-dfs-with-packed-cache/
impl Solution {
    pub fn min_distance(w1: String, w2: String) -> i32 {
        // Packed vec to increase lookup speeds.
        let mut cache = vec![-1; (w1.len() + 1) * (w2.len() + 1)];

        fn dfs(i: usize, j: usize, w1: &Vec<char>, w2: &Vec<char>, cache: &mut Vec<i32>) -> i32 {
            // One index out of bounds so we delete all chars that are left in the other one and are done.
            if i >= w1.len() || j >= w2.len() {
                return ((w1.len() - i) + (w2.len() - j)) as i32;
            }

            // Same chars here so no op required.
            if w1[i] == w2[j] {
                if cache[((i + 1) * (w2.len() + 1)) + (j + 1)] == -1 {
                    cache[((i + 1) * (w2.len() + 1)) + (j + 1)] = dfs(i + 1, j + 1, w1, w2, cache);
                }

                return cache[((i + 1) * (w2.len() + 1)) + (j + 1)];
            }

            // Find the cheapest operation.
            return *[(i + 1, j), (i, j + 1), (i + 1, j + 1)].map(|(k, l)| {
                if cache[(k * (w2.len() + 1)) + l] == -1 {
                    cache[(k * (w2.len() + 1)) + l] = dfs(k, l, w1, w2, cache);
                }

                cache[(k * (w2.len() + 1)) + l] + 1
            }).into_iter().min().unwrap()
        }

        dfs(0, 0, &w1.chars().collect(), &w2.chars().collect(), &mut cache)
    }
}