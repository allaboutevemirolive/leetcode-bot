// https://leetcode.com/problems/max-points-on-a-line/solutions/3019448/rust-calculate-the-angle-between-all-points-and-count-using-a-hashmap-n-2/
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        type Point = (i32, i32);
        let mut max = 0;

        let points = points
            .into_iter()
            .map(|p| (p[0], p[1]))
            .collect::<Vec<Point>>();

        for from in &points {
            let mut angle_intersection_count = std::collections::HashMap::new();
            let mut local_max = 1;
            for to in &points {
                if from != to {
                    let (dx, dy) = (to.0 - from.0, to.1 - from.1);
                    let angle = (dx as f64).atan2(dy as f64);
                    let intersection_count =
                        angle_intersection_count.entry(angle.to_bits()).or_insert(1);
                    *intersection_count += 1;
                    local_max = std::cmp::max(local_max, *intersection_count);
                }
            }
            max = std::cmp::max(max, local_max);
        }
        max
    }
}