function checkEdges(data){
  const pattern=/^[A-Z]->[A-Z]$/;
  const good=[];
  const bad=[];

  for(let item of data){
    let val=item.trim();

    if(val===""){
      bad.push(item);
      continue;
    }

    if(!pattern.test(val)){
      bad.push(val);
      continue;
    }

    if(val[0]===val[3]){
      bad.push(val);
      continue;
    }

    good.push(val);
  }

  return{good,bad};
}

function filterDuplicates(arr){
  const seen=new Set();
  const dupSeen=new Set();
  const clean=[];
  const dups=[];

  for(let edge of arr){
    if(seen.has(edge)){
      if(!dupSeen.has(edge)){
        dups.push(edge);
        dupSeen.add(edge);
      }
    }else{
      seen.add(edge);
      clean.push(edge);
    }
  }

  return{clean,dups};
}

function createGraph(edges){
  const graph={};
  const parentMap={};
  const nodes=new Set();

  for(let e of edges){
    const[p,c]=e.split("->");

    nodes.add(p);
    nodes.add(c);

    if(parentMap[c]!==undefined)continue;

    parentMap[c]=p;

    if(!graph[p])graph[p]=[];
    graph[p].push(c);
  }

  return{graph,parentMap,nodes};
}

function makeGroups(nodes,edges){
  const parent={};

  function find(x){
    if(parent[x]===undefined)parent[x]=x;
    if(parent[x]!==x)parent[x]=find(parent[x]);
    return parent[x];
  }

  function join(a,b){
    const ra=find(a);
    const rb=find(b);
    if(ra!==rb)parent[ra]=rb;
  }

  for(let n of nodes)find(n);

  for(let e of edges){
    const[p,c]=e.split("->");
    join(p,c);
  }

  const groups={};

  for(let n of nodes){
    const r=find(n);
    if(!groups[r])groups[r]=[];
    groups[r].push(n);
  }

  return Object.values(groups);
}

function hasLoop(group,graph){
  const state={};

  for(let n of group)state[n]=0;

  function dfs(node){
    state[node]=1;

    const kids=graph[node]||[];

    for(let k of kids){
      if(!(k in state))continue;

      if(state[k]===1)return true;
      if(state[k]===0&&dfs(k))return true;
    }

    state[node]=2;
    return false;
  }

  for(let n of group){
    if(state[n]===0){
      if(dfs(n))return true;
    }
  }

  return false;
}

function makeTree(root,graph){
  const obj={};
  const kids=graph[root]||[];

  for(let k of kids){
    obj[k]=makeTree(k,graph);
  }

  return obj;
}

function depthCalcFactory(graph){
  const memo={};

  function getDepth(node){
    if(memo[node])return memo[node];

    const kids=graph[node]||[];

    if(kids.length===0)return memo[node]=1;

    return memo[node]=1+Math.max(...kids.map(getDepth));
  }

  return getDepth;
}

function processData(data){
  if(data.length===0){
    return{
      hierarchies:[],
      invalid_entries:[],
      duplicate_edges:[],
      summary:{
        total_trees:0,
        total_cycles:0,
        largest_tree_root:""
      }
    };
  }

  const{good,bad}=checkEdges(data);
  const{clean,dups}=filterDuplicates(good);
  const{graph,parentMap,nodes}=createGraph(clean);
  const groups=makeGroups(nodes,clean);

  const result=[];
  const getDepth=depthCalcFactory(graph);

  for(let g of groups){
    const roots=g.filter(x=>parentMap[x]===undefined);

    let root;
    if(roots.length>0){
      root=[...roots].sort()[0];
    }else{
      root=[...g].sort()[0];
    }

    const cycle=hasLoop(g,graph);

    if(cycle){
      result.push({
        root,
        tree:{},
        has_cycle:true
      });
    }else{
      const tree={};
      tree[root]=makeTree(root,graph);

      result.push({
        root,
        tree,
        depth:getDepth(root)
      });
    }
  }

  const trees=result.filter(x=>!x.has_cycle);
  const cycles=result.filter(x=>x.has_cycle);

  let bestRoot="";

  if(trees.length>0){
    let best=trees[0];

    for(let t of trees){
      if(t.depth>best.depth||(t.depth===best.depth&&t.root<best.root)){
        best=t;
      }
    }

    bestRoot=best.root;
  }

  return{
    hierarchies:result,
    invalid_entries:bad,
    duplicate_edges:dups,
    summary:{
      total_trees:trees.length,
      total_cycles:cycles.length,
      largest_tree_root:bestRoot
    }
  };
}

module.exports={processData};