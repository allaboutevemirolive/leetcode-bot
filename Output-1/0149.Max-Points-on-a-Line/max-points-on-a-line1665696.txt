// https://leetcode.com/problems/max-points-on-a-line/solutions/1665696/rust-solution/
#[derive(Hash, Eq, PartialEq)]
struct Line {
    y: i32, // slope y
    x: i32, // slope x
    b: i32  // scaled y intercept
}

#[derive(Hash, Eq, PartialEq)]
struct Point {
    x: i32,
    y: i32
}

use std::collections::HashMap;
use std::collections::HashSet;

impl Solution {
    fn gcd(x: i32, y: i32) -> i32 {
        if x == 0 { return y; }
        if y == 0 { return x; }
        if x == y { return x; }
        if x > y {
            return Solution::gcd(x - y, y);
        }
        return Solution::gcd(x, y - x);
    }

    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        if points.len() <= 2 {
            return points.len() as i32;
        }
        let mut H: HashMap<Line, HashSet<Point>> = HashMap::new();
        for (i,p) in points.iter().enumerate() {
            for j in i+1..points.len() {
                let a: (i32, i32) = (p[0], p[1]);
                let b: (i32, i32) = (points[j][0], points[j][1]);
                let mut line: Line;
                
                if a.0 == b.0 {
                    // vertical line
                    line = Line{y: 1, x: 0, b: a.0};
                } else if a.1 == b.1 {
                    // horizontal line
                    line = Line{y: 0, x: 1, b: a.1};
                } else {
                    let mut y = b.1 - a.1;
                    let mut x = b.0 - a.0;
                    let g = Solution::gcd(y.abs(), x.abs());
                    y /= g;
                    x /= g;
                    if x < 0 && y > 0 {
                        y *= -1;
                        x *= -1;
                    }
                    // b = p.y - m * p.x
                    // m = y / x
                    // b * x = p.y * x - y * p.x
                    line = Line{y: y, x: x, b: x * a.1 - y * a.0};
                }
                let h = H.entry(line).or_insert(HashSet::new());
                h.insert(Point{x: a.0, y: a.1});
                h.insert(Point{x: b.0, y: b.1});
            }
        }
        let mut res = 0;
        for (_, v) in H.iter() {
            if v.len() > res {
                res = v.len();
            }
        }
        return res as i32;
    }
}