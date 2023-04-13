// https://leetcode.com/problems/max-points-on-a-line/solutions/3021462/rust-hashing-o-n-2-with-implementation-of-floats-as-fractions/
pub fn gcd(mut n: i32, mut m: i32) -> i32 {
    assert!(n != 0 && m != 0);
    while m != 0 {
        if m < n {
            std::mem::swap(&mut m, &mut n);
        }
        m %= n;
    }
    n
}

// point with integer coordinates
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

// Hashable rational number 32
// positive numnerator, positive denominator, sign
#[derive(Debug, PartialEq, Hash, Eq)]
struct Frac32(i32, i32, i8);

impl Frac32 {
    pub fn new(numerator: i32, denominator: i32) -> Frac32 {
        let gcd = match (numerator, denominator) {
            (0, _) | (_, 0) => 1,
            _ => gcd(numerator.abs(), denominator.abs()),
        };
        let sign = match (numerator.is_negative(), denominator.is_negative()) {
            (true, false) | (false, true) => -1,
            _ => 1,
        };
        let (numerator, denominator, sign) = match (numerator, denominator, sign) {
            (0, 0, _) => (0, 0, 1), // 0/0 NaN = +NaN = -NaN
            (_, 0, _) => (1, 0, sign), // normalize infinity to 1/0
            (0, _, _) => (0, 1, 1), // normalize 0 to 0/1
            (numerator, denominator, sign) => (numerator.abs(), denominator.abs(), sign),
        };
        Frac32(numerator / gcd, denominator / gcd, sign)
    }
}

// y = mx + c
#[derive(Debug, PartialEq, Hash, Eq)]
struct Line {
    m: Frac32,
    c: Frac32,
}

impl Line {
    pub fn new(p1: &Point, p2: &Point) -> Line {
        match p2.x == p1.x {
            true => Self {
                m: Frac32(1, 0, 1),
                c: Frac32(
                    p1.x.abs(),
                    1,
                    match p1.x.is_negative() {
                        true => -1,
                        false => 1,
                    },
                ),
            },
            false => Self {
                m: Frac32::new(p2.y - p1.y, p2.x - p1.x),
                c: Frac32::new(p1.y * (p2.x - p1.x) - p1.x * (p2.y - p1.y), p2.x - p1.x),
            },
        }
    }
}

impl Solution {
    // invert sigma n
    fn q(p: i32) -> i32 {
        (1 + (f64::sqrt(1.0 + 4.0 * p as f64) as i32)) / 2
    }
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        if points.len() <= 2 {
            return points.len() as i32;
        }
        let points: Vec<Point> = points.iter().map(|p| Point { x: p[0], y: p[1] }).collect();
        let mut eqns = std::collections::HashMap::new();
        for i in 0..points.len() {
            for j in 0..points.len() {
                if i != j {
                    *eqns
                        .entry(Line::new(&points[i], &points[j]))
                        .or_insert(0) += 1
                }
            }
        }
        Self::q(
            *eqns
                .iter()
                .max_by(|a, b| a.1.cmp(&b.1))
                .map(|(_k, v)| v)
                .unwrap(),
        )
    }
}