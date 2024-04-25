const { drive } = require('../../utils');
const fs = require('fs');
const fs2 = require('node:fs/promises');
module.exports.updateNodes = (tree, member, id) => {
  function traverse(node, currentid) {
    let subparent = id.substr(0, id.length - 2);
    let subchild = id.substr(id.length - 1, id.length);
    if (currentid === subparent) {
      node.children[subchild - 1].name = member.name;
      node.children[subchild - 1].gender = member.gender;
      node.children[subchild - 1].id = id;
      for (let i = 0; i < member.noOfChildren; i++) {
        node.children[subchild - 1].children.push({
          name: null,
          gender: null,
          id: null,
          children: []
        });
      }
      return node;
    } else if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result = traverse(child, child.id);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  if (id == '1') {
    tree.name = member.name;
    tree.gender = member.gender;
    tree.id = member.memberId;

    for (let i = 0; i < member.noOfChildren; i++)
      tree.children.push({
        name: null,
        gender: null,
        id: null,
        children: []
      });
    return tree;
  }

  traverse(tree, '1');
};

module.exports.searchNode = (tree, searchTree, id, level) => {
  for (let i = 0; i < tree.children.length; i++) {
    if (level < id.length) {
      if (i + 1 == id[level]) {
        searchTree.children.push({
          name: tree.children[i].name,
          id: tree.children[i].id,
          gender: tree.children[i].gender,
          children: []
        });
        this.searchNode(
          tree.children[i],
          searchTree.children[i],
          id,
          level + 2
        );
      } else {
        searchTree.children.push({
          name: null,
          id: null,
          gender: null,
          children: []
        });
      }
    }
  }
};

module.exports.treeFileUpdate = async (member, family) => {
  const file = await drive.files.get({
    fileId: family.treeFile,
    alt: 'media'
  });
  const tree = file.data;
  this.updateNodes(tree, member, member.memberId);

  await drive.files.delete({
    fileId: family.treeFile
  });
  await fs2.writeFile(`${family.name}.json`, JSON.stringify(tree));
  const fileData = await drive.files.create({
    media: {
      mimeType: 'application/json',
      body: fs.createReadStream(`${family.name}.json`)
    },
    requestBody: {
      name: `${family.name}.json`,
      parents: ['1TsGsVMt5KwFrdVwQ4mUo4xhluuvuFVWy']
    },
    fields: 'id,name'
  });
  fs.unlinkSync(`${family.name}.json`);
  family.treeFile = fileData.data.id;
  await family.save();
};

module.exports.memberTreePath = async (family, memberId) => {
  const file = await drive.files.get({
    fileId: family.treeFile,
    alt: 'media'
  });
  const tree = file.data;
  const searchTree = {};
  searchTree.name = tree.name;
  searchTree.gender = tree.gender;
  searchTree.id = tree.id;
  searchTree.children = [];
  if (memberId == '1') return searchTree;
  this.searchNode(tree, searchTree, memberId, 2);
  return searchTree;
};
