// https://leetcode.com/problems/max-points-on-a-line/solutions/3017244/rust-hashmap/
use crate::Solution;

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        points
            .iter()
            .fold(&mut std::collections::HashMap::new(), |mem, p1| {
                points.iter().fold(mem, |mem, p2| match p1 == p2 {
                    true => mem,
                    false => inc(mem, Line::from((p1, p2))),
                })
            })
            .values()
            .max()
            .and_then(|&i| (1..=i).filter(|n| n * (n - 1) == i).last().unwrap().into())
            .unwrap_or(1)
    }
}

#[derive(Hash, PartialEq, Eq, Clone, Copy)]
struct Fraction(i32, i32);
impl Fraction {
    fn inf() -> Self {
        Fraction(1, 0)
    }
    fn normalize(&self) -> Self {
        match () {
            _ if self.0 == 0 => Self(0, 1),
            _ if self.1 == 0 => Self(1, 0),
            _ if self.1 < 0 => Self(-self.0, -self.1).normalize(),
            _ => match match self.0 < 0 {
                true => gcd(-self.0, self.1),
                false => gcd(self.0, self.1),
            } {
                g => Self(self.0 / g, self.1 / g),
            },
        }
    }
}
impl From<i32> for Fraction {
    fn from(i: i32) -> Self {
        Fraction(i, 1).normalize()
    }
}
impl From<(i32, i32)> for Fraction {
    fn from((n, d): (i32, i32)) -> Self {
        Fraction(n, d).normalize()
    }
}

impl std::ops::Add for Fraction {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        Fraction(self.0 * rhs.1 + self.1 * rhs.0, self.1 * rhs.1).normalize()
    }
}
impl std::ops::Neg for Fraction {
    type Output = Self;
    fn neg(self) -> Self::Output {
        Fraction(-self.0, self.1).normalize()
    }
}
impl std::ops::Sub for Fraction {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self::Output {
        (self + (-rhs)).normalize()
    }
}

impl std::ops::Mul for Fraction {
    type Output = Self;
    fn mul(self, rhs: Self) -> Self::Output {
        Fraction(self.0 * rhs.0, self.1 * rhs.1).normalize()
    }
}

/// y = m * x + c
#[derive(Hash, PartialEq, Eq)]
struct Line {
    m: Fraction,
    c: Fraction,
}

impl From<(&Vec<i32>, &Vec<i32>)> for Line {
    fn from((p1, p2): (&Vec<i32>, &Vec<i32>)) -> Line {
        match p2[0] == p1[0] {
            true => Line {
                m: Fraction::inf(),
                c: Fraction::from(p1[0]),
            },
            false => match Fraction::from((p2[1] - p1[1], p2[0] - p1[0])) {
                k => Line {
                    m: k,
                    c: Fraction::from(p1[1]) - k * Fraction::from(p1[0]),
                },
            },
        }
    }
}

fn gcd(a: i32, b: i32) -> i32 {
    match () {
        _ if b > a => gcd(b, a),
        _ if b == 0 => a,
        _ => gcd(b, a % b),
    }
}

type Mem<'a> = &'a mut std::collections::HashMap<Line, i32>;
fn inc(mem: Mem, key: Line) -> Mem {
    *mem.entry(key).or_insert(0) += 1;
    mem
}