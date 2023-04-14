// https://leetcode.com/problems/max-points-on-a-line/solutions/3020744/rust-hashmap/
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        points.iter().enumerate().fold(0, |max, (i, p)| {
            let mut slopes = std::collections::HashMap::new();

            points.iter().rev().take(points.len() - i - 1).for_each(|o| {
                let (dx, dy) = (o[0] - p[0], o[1] - p[1]);
                let slope = if dx == 0 {
                    i32::MAX
                } else {
                    (100000.0 * (dy as f64 / dx as f64)) as i32
                };
                *slopes.entry(slope).or_insert(1) += 1;
            });

             std::cmp::max(max, slopes.values().max().map_or(1, |m| *m))
        })
    }
}