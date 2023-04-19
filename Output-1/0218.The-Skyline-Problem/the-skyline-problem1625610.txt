// https://leetcode.com/problems/the-skyline-problem/solutions/1625610/rust-ordered-map/
use std::cmp::Ordering;
use std::collections::BTreeMap;

#[derive(Debug, Eq, Ord, PartialEq, PartialOrd)]
struct Point {
    t: char,
    x: i32,
    y: i32
}

impl Solution {
    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut points: Vec<Point> = Vec::new();
        for b in buildings.iter() {
            points.push(Point{t: 'S', x: b[0], y: b[2]});
            points.push(Point{t: 'E', x: b[1], y: b[2]});
        }
        points.sort_by(|i, j| {
            if i.x.cmp(&j.x) == Ordering::Equal {
                if i.t.cmp(&j.t) == Ordering::Equal {
                    if i.t == 'S' {
                        return i.y.cmp(&j.y).reverse();
                    } else {
                        return i.y.cmp(&j.y);
                    }
                } else {
                    if i.t == 'S' {
                        return Ordering::Less;
                    } else {
                        return Ordering::Greater;
                    }
                } 
            } 
            i.x.cmp(&j.x)
        });

        let mut H: BTreeMap<i32, i32> = BTreeMap::new();
        let mut height: i32 = 0;
        H.insert(height, 1);
        let mut skyline: Vec<Vec<i32>> = Vec::new();
        
        for p in points.iter() {
            if p.t == 'S' {
                *H.entry(p.y).or_insert(0) += 1;
            } else {
                let mut count = 0;
                if let Some(v) = H.get_mut(&p.y) {
                    *v -= 1;
                    count = *v;
                }
                if count == 0 {
                    H.remove(&p.y);
                }
            }
            if let Some(T) = H.iter().next_back() {
                if height != *T.0 {
                    skyline.push(vec![p.x, *T.0]);
                    height = *T.0;
                }
            }
        }
        skyline
    }
}