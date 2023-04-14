// https://leetcode.com/problems/max-points-on-a-line/solutions/3018352/rust-mapping-slope-axis-intercept-to-point-sets/
use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let mut map = HashMap::new();
        points.iter().map(Point::from).enumerate().map(|(i, p1)| {
            map.clear();
            points.iter().skip(i + 1).map(Point::from).map(|p2| {
                let line = Line::new(p1, p2);
                let intercept = line.y_intercept()
                                    .unwrap_or_else(||p1.x.into());
                let point_set = map .entry((line.slope(), intercept))
                                    .or_insert_with(HashSet::new);
                point_set.extend([p1, p2]);
                point_set.len()
            }).max().unwrap_or(1)
        }).max().unwrap() as i32
    }
}