// https://leetcode.com/problems/max-points-on-a-line/solutions/2053037/rust-solution-o-n/
use std::collections::HashMap;

fn gcd(a: i32, b: i32) -> i32 {
    if a == 0 || b == 0 {
        return 0;
    }
    
    let mut a = a;
    let mut b = b;
    while b > 0 {
        let r = a % b;
        a = b;
        b = r;
    }
    
    a
}

// Line is represented as y = m*x + c 
// m and c are mostly enough to identify the line
// m, c are rational numbers (because of integer coordinates) but in 
// general floating point numbers can be insufficient to guarantee uniqueness 
// as they are still finite precision
// So for most real-valued cases we use numerator and denominator
// to represent m and c
// if m -> ±∞ then we use the x-intercept to identify the line
// if m == 0 then we use the y-intercept to identify the line
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum LineId {
    Inf(i32), // x-intercept
    MC((i32, i32), (i32, i32)), // numerator, denominator tuples for m and c respectively
    Zero(i32), // y-intercept
}

impl Solution {
    pub fn max_points(points: Vec<Vec<i32>>) -> i32 {
        if points.len() == 1 {
            return 1;
        }
        // y - y0 = (y1 - y0)/(x1 - x0) * (x - x0)
        // y = dy / dx x + (dx*y0 - dy*x0)/dx
        let mut fm: HashMap<LineId, i32> = HashMap::new();
        points.iter().enumerate().flat_map(|(i, pt1)| {
            points.iter().skip(i+1).map(move |pt2| {
                // We swap the points around to make sure that dy >= 0
                // since we are storing the fraction numerator and denominator separately
                let (x0, y0, x1, y1) = if pt2[1] > pt1[1] || (pt2[1] == pt1[1] && pt2[0] > pt2[1]) {
                    (pt1[0], pt1[1], pt2[0], pt2[1])
                } else {
                    (pt2[0], pt2[1], pt1[0], pt1[1])
                };
                
                // println!("({x0}, {y0}), ({x1}, {y1})");
                
                let mut dy = (y1 - y0);
                let mut dx = (x1 - x0);

                let g = gcd(dy.abs(), dx.abs());
                if g != 0 {
                    dy /= g;
                    dx /= g;
                }
                
                if dx != 0 && dy != 0 {
                    // The slope is non-zero and finite so we can achieve consistent
                    // line representation using numerator, denominator representation
					// because we have already preprocessed dy and dx for sign consistency
					// and removed gcd from both dy and dx 
                    LineId::MC((dy, dx), (dx*y0 - dy*x0, dx))
                } else if dx == 0 {
                    // Here the x intercept is enough to identify common lines
                    LineId::Inf(x0)
                } else {
                    // Here the y intercept is enough to identify common lines
                    LineId::Zero(y0)
                }
            })
        })
        .for_each(|k| {
            // println!("{k:?}");
            *fm.entry(k).or_insert(0) += 1;
        });
        let n = fm.values().max().cloned().unwrap();
		// if m points lie on a line and we have processed all the points pairwise
		// then n = m * (m - 1) / 2 pairs of points would have matched to the same line
        // m^2 - m - 2*n = 0 => m = (1 + sqrt(8*n + 1)) / 2 
        (1 + (8f64*n as f64 + 1f64).sqrt() as i32) / 2
    }
}