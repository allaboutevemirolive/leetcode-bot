// https://leetcode.com/problems/perfect-rectangle/solutions/2801494/rust-check-corners/
use std::collections::HashSet;

impl Solution {
    pub fn is_rectangle_cover(rectangles: Vec<Vec<i32>>) -> bool {
        let (x,y,a,b,area,corners) = rectangles.iter().fold((i32::MAX,i32::MAX,i32::MIN,i32::MIN,0,HashSet::new()), |(x,y,a,b,area,mut corners),v| {
            for corner in [(v[0],v[1]),(v[2],v[1]),(v[0],v[3]),(v[2],v[3])] {
                if !corners.remove(&corner) {
                    corners.insert(corner);
                }
            }
            (x.min(v[0]),y.min(v[1]),a.max(v[2]),b.max(v[3]),area + (v[2]-v[0])*(v[3]-v[1]), corners)
        });
        (a - x) * (b - y) == area && corners == HashSet::from([(a,b),(x,b),(a,y),(x,y)]) 
    }
}