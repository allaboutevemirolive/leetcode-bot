// https://leetcode.com/problems/max-points-on-a-line/solutions/3021093/rust-time-o-n2-mem-o-n/
use std::collections::HashMap;
impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let size = points.len();
        if size <= 2 {
            return size as i32;
        }

        let mut max_points = 0;
        for i in 0..size {
            let mut vertical_points = 0;
            let mut current_max = 0;
            let mut slops = HashMap::new();

            // we calculate slops for each point
            for j in i + 1..size {
                // slop of a line: y1 - y2 / x1 - x2
                // we can not divide 0 so we have this if
                if points[i][0] == points[j][0] {
                    vertical_points += 1;
                } else {
                    let mut dx = points[i][0] - points[j][0];
                    let mut dy = points[i][1] - points[j][1];
                    let mut gcd = Self::find_gcd(dy.abs(), dx.abs());

                    // convert -1/-2 => 1/2
                    if dx < 0 && dy < 0 {
                        gcd = -gcd
                    }

                    // convert 1/-4 => -1/4
                    if dy < 0 && dx > 0 {
                        gcd = -gcd
                    }

                    dx /= gcd;
                    dy /= gcd;

                    let key = if dy == 0 {
                        format!("0")
                    } else {
                        format!("{dy}/{dx}")
                    };
                    slops.entry(key).and_modify(|v| *v += 1).or_insert(1);
                }
            }

            for (_, v) in slops {
                if v > current_max {
                    current_max = v;
                }
            }

            max_points = Self::max(max_points, Self::max(current_max, vertical_points));
        }

        max_points + 1
    }

    pub fn max(v1: i32, v2: i32) -> i32 {
        if v1 > v2 {
            return v1;
        }
        v2
    }

    pub fn find_gcd(mut v1: i32, mut v2: i32) -> i32 {
        let mut rem = v1 % v2;

        while rem != 0 {
            v1 = v2;
            v2 = rem;
            rem = v1 % v2;
        }

        v2
    }
}