// https://leetcode.com/problems/serialize-and-deserialize-binary-tree/solutions/2825298/rust-dfs/
impl Codec {
    fn new() -> Self {
        Self {}
    }

    fn serialize(&self, root: Option<Rc<RefCell<TreeNode>>>) -> String {
        let mut root = root;
        let mut result = String::new();
        Self::dfs_serialize(&mut root, &mut result);
        result
    }
	
    fn deserialize(&self, data: String) -> Option<Rc<RefCell<TreeNode>>> {
        let node_vals = data.split(",").collect::<Vec<&str>>();
        let mut idx = 0;
        Self::dfs_deserialize(&node_vals, &mut idx)
    }
    
    fn dfs_serialize(root: &Option<Rc<RefCell<TreeNode>>>, result: &mut String) {
        match (root) {
            None => {
                *result += "N,";
            }, 
            Some(node) => {
                let val = node.borrow().val;
                *result += (val.to_string() + ",").as_str();
                Self::dfs_serialize(&node.borrow().left, result);
                Self::dfs_serialize(&node.borrow().right, result);
            }
        }
    }
    
    fn dfs_deserialize(node_vals: &Vec<&str>, idx: &mut usize) -> Option<Rc<RefCell<TreeNode>>> {
        if node_vals[*idx] == "N" {
            *idx += 1;
            return None; 
        }
        let val = node_vals[*idx].parse().unwrap();
        *idx += 1;
        Some(Rc::new(RefCell::new(TreeNode {
            val: val,
            left: Self::dfs_deserialize(node_vals, idx),
            right: Self::dfs_deserialize(node_vals, idx),
        })))
    }
}