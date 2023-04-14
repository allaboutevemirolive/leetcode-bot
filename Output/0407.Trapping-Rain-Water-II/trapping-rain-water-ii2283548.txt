// https://leetcode.com/problems/trapping-rain-water-ii/solutions/2283548/rust-solution-using-binaryheap/
use std::cmp::Reverse;
use std::collections::BinaryHeap;
impl Solution {
    pub fn trap_rain_water(height_map: Vec<Vec<i32>>) -> i32 {
        let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let (m, n) = (height_map.len(), height_map[0].len());
        let mut flag = vec![vec![false; n]; m];
        let mut pq = BinaryHeap::new();
        
        for i in 0..m {
            for j in 0..n {
                if (i != 0 && i != m - 1 && j != 0 && j !=  n - 1) { continue; }
                pq.push(Reverse((height_map[i][j], i, j)));
                flag[i][j] = true;
            }
        }
        
        let mut ret = 0;
        while pq.is_empty() == false {
            match pq.pop() {
                Some(node) => {
                    let (h, i, j) = ((node.0).0, (node.0).1, (node.0).2);
                    for d in dirs{
                        let (x, y) = (i as i32 + d[0], j as i32 + d[1]);
                        if x < 0 || x == m as i32 || y < 0 || y == n as i32 { continue; }
                        let (x, y) = (x as usize, y as usize);
                        if flag[x][y] == true { continue; }
                        flag[x][y] = true;
                        if height_map[x][y] < h { 
                            ret += h - height_map[x][y];
                        }
                        pq.push(Reverse((h.max(height_map[x][y]), x, y)));
                    }
                }
                None => { panic!(); }
            }
        }
        
        ret
    }
}