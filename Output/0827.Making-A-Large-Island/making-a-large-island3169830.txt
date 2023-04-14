// https://leetcode.com/problems/making-a-large-island/solutions/3169830/rust-union-find-union-by-size/
impl Solution {
    pub fn largest_island(grid: Vec<Vec<i32>>) -> i32 {
        largest_island(grid)
    }
}

// `Union()` by size and `Find()` with path compression
pub struct UnionFind {
    parents: Vec<usize>,
    sizes: Vec<usize>,
}

impl UnionFind {
    pub fn new(size: usize) -> Self {
        Self {
            sizes: vec![1; size],
            parents: (0..size).collect(),
        }
    }

    fn size(&self, root: usize) -> usize {
        self.sizes[root]
    }

    pub fn find(&mut self, key: usize) -> usize {
        if self.parents[key] == key {
            return key;
        }

        let parent = self.find(self.parents[key]);
        self.parents[key] = parent;
        parent
    }

    pub fn union(&mut self, a: usize, b: usize) -> bool {
        let x = self.find(a);
        let y = self.find(b);

        // A and B are already in the same set -> nothing to do
        if x == y {
            return false;
        }

        let xr = self.sizes[x];
        let yr = self.sizes[y];

        if xr <= yr {
            self.parents[x] = y;
            self.sizes[y] = xr + yr;
        } else {
            self.parents[y] = x;
            self.sizes[x] = xr + yr;
        }

        true
    }
}



pub fn largest_island(grid: Vec<Vec<i32>>) -> i32 {
    assert!(grid.len() > 0);
    let cols = grid[0].len();

    let mut uf = UnionFind::new(grid.len() * grid[0].len());

    // connect cells horizontally
    for r in 0..grid.len() {
        for c in 1..grid[r].len() {
            if grid[r][c - 1] == 1 && grid[r][c] == 1 {
                uf.union(r * cols + c, r * cols + c - 1);
            }
        }
    }

    // connect cells vertically
    for c in 0..grid[0].len() {
        for r in 1..grid.len() {
            if grid[r - 1][c] == 1 && grid[r][c] == 1 {
                uf.union(r * cols + c, (r - 1) * cols + c);
            }
        }
    }

    let mut answer = 0;

    // track each set root because a 0 can
    // have the same island touching more 
    // than one of its sides, but we must 
    // count it only once
    let mut roots = Vec::with_capacity(4);

    // check every zero on the grid
    for r in 0..grid.len() {
        for c in 0..grid[r].len() {
            if grid[r][c] != 0 {
                continue;
            }

            roots.clear();
            let mut size = 0;

            if r > 0 && grid[r - 1][c] == 1 {
                let root = uf.find((r - 1) * cols + c);
                size = uf.size(root);
                roots.push(root);
            }

            if c > 0 && grid[r][c - 1] == 1 {
                let root = uf.find(r * cols + c - 1);
                if !roots.contains(&root) {
                    size += uf.size(root);
                    roots.push(root);
                }
            }

            if c < grid[r].len() - 1 && grid[r][c + 1] == 1 {
                let root = uf.find(r * cols + c + 1);
                if !roots.contains(&root) {
                    size += uf.size(root);
                    roots.push(root);
                }
            }

            if r < grid.len() - 1 && grid[r + 1][c] == 1 {
                let root = uf.find((r + 1) * cols + c);
                if !roots.contains(&root) {
                    size += uf.size(root);
                }
            }

            answer = answer.max(size + 1);
        }
    }

    // In case there was no `0` in the grid
    // I.e. the whole grid is one huge island
    if answer == 0 {
        answer = grid.len() * grid[0].len();
    }

    answer as i32
}
