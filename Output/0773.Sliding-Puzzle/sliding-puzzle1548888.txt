// https://leetcode.com/problems/sliding-puzzle/solutions/1548888/rust-generate-all-states-and-find-the-target/
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, Hash, Eq, PartialEq)]
struct Board {
    data: [u8; 6],
}

impl Board {
    fn solved() -> Self {
        Self {
            data: [1, 2, 3, 4, 5, 0],
        }
    }
    fn from_matrix(m: &Vec<Vec<i32>>) -> Self {
        let data = [
            m[0][0] as u8,
            m[0][1] as u8,
            m[0][2] as u8,
            m[1][0] as u8,
            m[1][1] as u8,
            m[1][2] as u8,
        ];
        Self { data }
    }
    fn neighbour_indices(index: usize) -> Vec<usize> {
        match index {
            0 => vec![1, 3],
            1 => vec![0, 4, 2],
            2 => vec![1, 5],
            3 => vec![0, 4],
            4 => vec![3, 1, 5],
            5 => vec![4, 2],
            _ => panic!("unexpected index"),
        }
    }
    fn gen_neighbours(&self) -> Vec<Self> {
        let zero = self.data.iter().position(|x| x == &0).unwrap();
        Self::neighbour_indices(zero)
            .iter()
            .map(|index| {
                let mut neighbour = self.clone();
                neighbour.data.swap(zero, *index);
                neighbour
            })
            .collect()
    }
}

impl Solution {
    pub fn sliding_puzzle(board: Vec<Vec<i32>>) -> i32 {
        let mut current = vec![Board::solved()];
        let mut distance = 0;
        let mut all_distances = HashMap::new();
        all_distances.insert(current[0], distance);
        while !current.is_empty() {
            distance += 1;
            current = current
                .iter()
                .flat_map(|m| m.gen_neighbours())
                .filter(|neighbour| all_distances.get(neighbour).is_none())
                .collect::<Vec<_>>();
            for m in current.iter() {
                all_distances.insert(*m, distance);
            }
        }
        all_distances
            .get(&Board::from_matrix(&board))
            .map(|d| *d as i32)
            .unwrap_or(-1)
    }
}