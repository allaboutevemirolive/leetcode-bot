// https://leetcode.com/problems/max-points-on-a-line/solutions/3016545/rust-with-hashmap/
use std::collections::HashMap;

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let mut hash: HashMap<(i64, i64), i32> = HashMap::new();
        for i in 1..points.len() {
            for j in 0..i {
                let x_diff = points[i][0] - points[j][0];
                let y_diff = points[i][1] - points[j][1];
                let (slope, intercept) = if x_diff == 0 {
                    (f64::INFINITY, points[i][0] as f64)
                }
                else {
                    let s = y_diff as f64 / x_diff as f64;
                    let c = points[i][1] as f64 - s * points[i][0] as f64;
                    (s, c)
                };
                let key = (Self::amplify(slope), Self::amplify(intercept));
                *hash.entry(key).or_insert(0) += 1;
            }
        }
        match hash.values().max() {
            None => 1,
            Some(&val) => (val as f64 * 2.0).sqrt() as i32 + 1,
        }
    }

    fn amplify(val: f64) -> i64 {
        (val * 1_000_000_000_000.0).round() as i64
    }
}