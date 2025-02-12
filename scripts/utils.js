const { ethers } = require("hardhat");

async function getContract({
    merkleRoot= "0x5ca28f7c92f8adc821003b5d761ae77281bb1525e382c7605d9b081262b2d534", // sample
    baseURI="",
}
){
    const [signer] = await ethers.getSigners();
    const Tubbies = await hre.ethers.getContractFactory("WhitelistedSale");
    const tubbies = await Tubbies.deploy(merkleRoot, baseURI);
    await tubbies.deployed();
    return {tubbies, signer}
}

async function deployMockContract(name){
    const Contract = await hre.ethers.getContractFactory(name);
    const contract = await Contract.deploy();
    await contract.deployed();
    return contract
}

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

function paddedBuffer(addr){
    const buf = Buffer.from(addr.substr(2).padStart(32*2, "0"), "hex")
    return Buffer.concat([buf]);
}

function buildTreeAndProof(
    leaves=[
        "0x4074bc05a89f1b97b51413b06f7e44f46eae6880",
        "0x1508dcc55173733f14624d98a65b8fac5d93d322",
        "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"
    ],
    addressToGetProof = "0x4074bc05a89f1b97b51413b06f7e44f46eae6880"
) {
    const tree = new MerkleTree(leaves.map(x => paddedBuffer(x)), keccak256, { sort: true })
    const root = tree.getHexRoot()
    const leaf = paddedBuffer(addressToGetProof)
    const proof = tree.getHexProof(leaf)
    return {tree, proof, root, leaf}
}

module.exports={
    getContract,
    buildTreeAndProof,
    deployMockContract
}