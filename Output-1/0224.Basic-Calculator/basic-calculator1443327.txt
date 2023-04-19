// https://leetcode.com/problems/basic-calculator/solutions/1443327/day-3-rust-intuition-from-scratch-ascii-art-slope-compare/
pub fn outer_trees(trees: Vec<Vec<i32>>) -> Vec<Vec<i32>> { // main
	let mut vertices: Vec<(i32, i32)> = Vec::new();
	for tree in trees {
		vertices.push((tree[0], tree[1]));
	}

	vertices.sort();
	return Solution::enclose_boundary(&vertices);
}

fn enclose_boundary(vertices: &Vec<(i32, i32)>) -> Vec<Vec<i32>> {
        let mut res: Vec<Vec<i32>> = Vec::new();
        if vertices.is_empty() {
            return res;
        }
        
        let N: usize = vertices.len();
        // determine left, right parts
        let (left, right): (i32, i32) = (vertices[0].0, vertices[N - 1].0);
        
        // insert left part
        let highest_left_idx: usize = Solution::push_boundary(
            &vertices,
            &mut res,
            0,
            N,
            vertices[0].0,
            false
        );
    
        if vertices[0].0 == vertices[N - 1].0 { // vertical line, so we're done
            return res;
        }
        
        let lowest_right_idx: usize = Solution::push_boundary(
            &vertices,
            &mut res,
            highest_left_idx + 1,
            N,
            vertices[N - 1].0,
            true
        );
        
        // now insert lower and upper boundaries
        let mut bottom_cands: Vec<(i32, i32)> = Vec::with_capacity(N);
        let mut top_cands: Vec<(i32, i32)> = Vec::with_capacity(N);
        for idx in (highest_left_idx + 1)..lowest_right_idx {
            if vertices[idx].0 != vertices[idx - 1].0 { // new lowest entry due to sorting
                bottom_cands.push((vertices[idx].0, vertices[idx].1));
                top_cands.push((vertices[idx].0, vertices[idx].1)); // keep track of upper
            } else { // repeat element - modify current back of upper candidate
                top_cands.last_mut().unwrap().1 = vertices[idx].1;
            }
        }
		// steps 5-6
		...
		
		return res;
}