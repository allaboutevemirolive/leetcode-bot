// https://leetcode.com/problems/shortest-path-to-get-all-keys/solutions/2785926/6ms-fastest-solution-across-all-languages-bitmap-memory-local-bfs-solution/
use std::collections::VecDeque;

struct Grid {
    data: Vec<u32>,
    rlen: usize,
    clen: usize,
    rstart: usize,
    cstart: usize,
    all_keys: u32,
}

const LOCK: u32= 1 << 31;
const WALL: u32 = 1 << 30;
const KEYMASK: u32 = 0x07FFFFFF;

impl Grid {
    fn new(strs: &Vec<String>) -> Self {
        let rlen = strs[0].len();
        let clen = strs.len();
        let mut rstart = 0;
        let mut cstart = 0;
        let mut v: Vec<u32> = vec![0; rlen * clen];
        let mut all_keys: u32 = 0;
        for (r, string) in strs.iter().enumerate() {
            for (c, ch) in string.as_bytes().iter().enumerate() {
                let m = *ch as char;
                match m {
                    '.' => (),
                    'a'..='z' => {
                        let key = ch - 'a' as u8;
                        v[r * rlen + c] |= 1 << key;
                        all_keys |= 1 << key;
                     },
                    'A'..='Z' => {
                        let key = ch - 'A' as u8;
                        v[r * rlen + c] |= LOCK | 1 << key;
                        all_keys |= 1 << key;
                    },
                    '#' => {
                        v[r * rlen + c] |= WALL;
                    },
                    '@' => {
                        rstart = r;
                        cstart = c;
                    },
                    _ => (),
                };
            }
        }
        Self {
            data: v,
            rlen,
            clen,
            rstart,
            cstart,
            all_keys,
        }
    }
}

#[derive(Clone)]
struct Cursor {
    mask: u32,
    r:    usize,
    c:    usize,
}

impl Cursor {
    fn new(mask: u32, r: usize, c: usize) -> Self {
        Self {
            mask,
            r,
            c,
        }
    }
}

fn handle_neighbor(visited_masks: &mut Vec<Vec<u32>>, grid: &Grid,
        q: &mut VecDeque<Cursor>, curr: Cursor, r: usize, c: usize) {
    let g = grid.data[grid.rlen * r + c];
    if g & WALL != 0 {
        return
    }

    if g & LOCK != 0 && curr.mask & g == 0 {
        return
    }
    let masks_list = visited_masks.get_mut(grid.rlen * r + c).unwrap();
    // Reverse makes this short circuit on recently added masks faster.
    let has_supermask = masks_list.iter().rev()
        .find(|b| **b | curr.mask <= **b).is_some();
    if has_supermask {
        return
    }
    // Remove submasks
    // Update your rustc leetcode:  used to be masks_list.drain_filter(|m| curr.mask | *m <= curr.mask);
    let mut ind = 0 as usize;
    let mut len = masks_list.len();
    while ind < len {
        let m = masks_list[ind];
        if curr.mask | m <= curr.mask {
            masks_list.swap_remove(ind);
            len = masks_list.len(); 
        } else {
            ind += 1;    
        }
    }
    masks_list.push(curr.mask);
    let newc = Cursor { mask: curr.mask, r, c };
    q.push_back(newc);
}

impl Solution {
    pub fn shortest_path_all_keys(input: Vec<String>) -> i32 {
        let grid = Grid::new(&input);
        let mut visited_masks = vec![Vec::<u32>::new(); grid.rlen * grid.clen];
        let mut current: VecDeque<Cursor> = VecDeque::new();
        let mut next: VecDeque<Cursor> = VecDeque::new();
        next.push_back(Cursor::new(0, grid.rstart, grid.cstart));
        let mut iteration = 0;
        while !next.is_empty() {
            let temp = next;
            next = current;
            current = temp;
            while !current.is_empty() {
                let mut cursor = current.pop_front().unwrap();
                let square = grid.data[grid.rlen * cursor.r + cursor.c];
                // check if is key now if not is lock
                // branchless lock check
                let lock_check = std::cmp::max(LOCK & square, KEYMASK) & KEYMASK;
                cursor.mask |= lock_check & square;
                if cursor.mask == grid.all_keys {
                    return iteration
                }

                // Prevent overscheduling by pushing the current mask if applicable
                let my_masks = visited_masks.get_mut(grid.rlen * cursor.r + cursor.c).unwrap();
                let len = my_masks.len();
                if len == 0 {
                    my_masks.push(cursor.mask);
                }

                // check if lock or wall later
                if cursor.r != 0 {
                    handle_neighbor(&mut visited_masks, &grid, &mut next, cursor.clone(),
                        cursor.r - 1, cursor.c);
                }
                if cursor.c != 0 {
                    handle_neighbor(&mut visited_masks, &grid, &mut next, cursor.clone(),
                        cursor.r, cursor.c - 1);
                }
                if cursor.r < grid.clen - 1 {
                    handle_neighbor(&mut visited_masks, &grid, &mut next, cursor.clone(),
                        cursor.r + 1, cursor.c);
                }
                if cursor.c < grid.rlen - 1 {
                    handle_neighbor(&mut visited_masks, &grid, &mut next, cursor.clone(),
                        cursor.r, cursor.c + 1);
                }
            }
            iteration += 1;
        }
        return -1
    }
}
