// https://leetcode.com/problems/max-points-on-a-line/solutions/3016407/rust-concise-1ms-hashmap/
use std::collections::HashMap;

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let mut max_len = 1;
        for p1 in 0..points.len() - 1 {
            let mut line_counts: HashMap<u32, i32> = HashMap::new();
            for p2 in (p1 + 1)..points.len() {
                let slope = (points[p2][1] - points[p1][1]) as f32 / (points[p2][0] - points[p1][0]) as f32;
                let slope = match slope {
                    -0.0 => 0.0,
                    core::f32::NEG_INFINITY => core::f32::INFINITY,
                    other => other,
                };

                let mut count = line_counts.entry(slope.to_bits()).or_insert(1);
                if *count + 1 > max_len { max_len = *count + 1 }
                *count += 1;
            }
        }
        return max_len;
    }
}