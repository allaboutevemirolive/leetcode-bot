// https://leetcode.com/problems/trapping-rain-water-ii/solutions/2234909/priority-queue-solution-with-explanation-100-faster-rust/
use std::cmp::Reverse;
use std::collections::binary_heap::BinaryHeap;

pub struct Solution;

impl Solution {
 /// ## Trapping Rain Water II
 /// - **Time complexity**: O(m*n*long(m*n)) | Each cell will be pushed into and popped out of the queue only once,
 /// which will cost O(log(queue_size)). (*Time complexity of Min heap operation*)
 /// Iterate the 2D matrix will cost M*N time complexity (M: rows, N: columns)
 ///
 /// - **Space complexity**: O(m*n) | Because priority queue will store all the node of the matrix
 ///
 /// Note: Using Min Heap (std::cmp::Reverse + std::collections::binary_heap::BinaryHeap)
 pub fn trap_rain_water(height_map: Vec<Vec<i32>>) -> i32 {
  let mut ans = 0;
  let dirs: Vec<(i32, i32)> = vec![(0, 1), (0, -1), (1, 0), (-1, 0)];
  let (r, c) = (height_map.len(), height_map[0].len());
  let mut visited: Vec<Vec<bool>> = vec![vec![false; c]; r];

  // The element in the PriorityQueue is an array with three elements encoding
  // the row number, column number and the height of the cell on the boundary.
  let mut pq = BinaryHeap::new();

  // We first build the initial boundary by enqueuing all cells
  // on the outer edges of the input matrix and mark them as visited
  for r in 0..height_map.len() {
   for c in 0..height_map[r].len() {
    if r > 0 && r < height_map.len() - 1 && c > 0 && c < height_map[r].len() - 1 {
     continue;
    }
    visited[r][c] = true;
    // Using Reverse to construct a Min Heap in Rust
    pq.push(Reverse((height_map[r][c], r, c)));
   }
  }

  while !pq.is_empty() {
   // Polling the cell with minimum height
   match pq.pop() {
    Some(node) => {
     let (cur_height, cur_row, cur_col) = ((node.0).0, (node.0).1, (node.0).2);

     for dir in dirs.iter() {
      let dr = (cur_row as i32 + dir.0) as usize;
      let dc = (cur_col as i32 + dir.1) as usize;

      let is_not_border = dr > 0 && dr < r - 1 && dc > 0 && dc < c - 1;
      if is_not_border && !visited[dr][dc] {
       // After obtaining the water contained for each of its neighbor,
       // we replace it with its neighbor and form a new boundary.
       // Again we continue until the container shrinks to a point.
       ans += std::cmp::max(0, cur_height - height_map[dr][dc]);
       visited[dr][dc] = true;
       pq.push(Reverse((
        std::cmp::max(cur_height, height_map[dr][dc]),
        dr,
        dc,
       )));
      }
     }
    }
    None => {
     unreachable!();
    }
   }
  }

  ans
 }
}