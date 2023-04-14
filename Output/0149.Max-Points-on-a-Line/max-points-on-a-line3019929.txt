// https://leetcode.com/problems/max-points-on-a-line/solutions/3019929/rust-simple-o-n-2-solution/
use std::collections::HashMap;

impl Solution {
    pub fn max_points(mut points: Vec<Vec<i32>>) -> i32 {
        fn gcd(a: i32, b: i32) -> i32 {
            if b == 0 {
                a
            } else {
                gcd(b, a % b)
            }
        }
        points.sort_by(|a, b| match a[0].cmp(&b[0]) {
            std::cmp::Ordering::Equal => a[1].cmp(&b[1]),
            o => o,
        });
        let n = points.len();
        let mut result = 1;
        for i in 0..n {
            let mut line = HashMap::new();
            let x1 = points[i][0];
            let y1 = points[i][1];
            for j in i + 1..n {
                let x2 = points[j][0];
                let y2 = points[j][1];
                let dx = x1 - x2;
                let dy = y1 - y2;
                let d = gcd(dx.abs(), dy.abs());
                let count = line.entry((dx / d, dy / d)).or_insert(1);
                *count += 1;
                result = result.max(*count);
            }
        }
        result
    }
}