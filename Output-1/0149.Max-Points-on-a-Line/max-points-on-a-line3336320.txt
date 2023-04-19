// https://leetcode.com/problems/max-points-on-a-line/solutions/3336320/rust-solution/
use std::collections::HashMap;

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let mut map: HashMap<(i64, i64), i32> = HashMap::new();
        let mut maxim = 0;
        for i in 1..points.len() {
            for j in 0..i {
                if points[i][0] == points[j][0] {
                    *map.entry((i64::MAX, points[i][1] as i64)).or_default() += 1;
                    continue
                }
                let k = ((points[i][1] - points[j][1]) as f64) / ((points[i][0] - points[j][0]) as f64);
                let b = (points[i][1] as f64) - k * points[i][0] as f64;
                *map.entry((Self::amplify(k), Self::amplify(b))).or_default() += 1;
            }
            maxim = maxim.max(*map.values().max().unwrap());
            map.drain();
        }
        maxim + 1
    }
    fn amplify(val: f64) -> i64 {
        (val * 1_000_000_000_000.0).round() as i64
    }
}