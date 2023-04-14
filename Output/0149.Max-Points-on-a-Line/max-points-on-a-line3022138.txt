// https://leetcode.com/problems/max-points-on-a-line/solutions/3022138/rust-hashmap-solution/
use std::collections::HashMap;

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        let inner = points.clone();

        points.iter().enumerate()
            .fold(1, |mut res, (i, point1)| {
                let hash = inner.iter().enumerate().fold(HashMap::<(i32, i32), i32>::new(), |mut map, (j, point2)| match j > i {
                    true => {
                        let (x1, y1) = (point1[0], point1[1]);
                        let (x2, y2) = (point2[0], point2[1]);
                        let a = x1 - x2;
                        let b = y1 - y2;
                        let k = Self::gcd(a, b);

                        let key = (a / k, b / k);

                        let count = map.entry(key).or_insert(0);
                        *count += 1;

                        map
                    },
                    false => map,
                });

                let max = match hash.values().max() {
                    None => 1,
                    Some(&val) => val + 1,
                };
                res = std::cmp::max(res, max);

                res
            })
    }

    fn gcd(a: i32, b: i32) -> i32 {
        if b == 0 { a } else { Self::gcd(b, a % b) }
    }
}