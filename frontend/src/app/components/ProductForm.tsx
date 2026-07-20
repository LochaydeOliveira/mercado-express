import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, Check, AlertCircle, Loader2 } from "lucide-react";
import { productService, Product } from "../../services/productService";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface ProductFormProps {
  productToEdit?: any;
  onBack: () => void;
  onSuccess: () => void;
}

export function ProductForm({ productToEdit, onBack, onSuccess }: ProductFormProps) {
  const isEditing = Boolean(productToEdit?.id);

  const [nome, setNome] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [preco, setPreco] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

useEffect(() => {
    if (productToEdit) {
      setNome(productToEdit.nome || productToEdit.name || "");
      setCodigoBarras(productToEdit.codigo_barras || productToEdit.codigo || "");
      setPreco(productToEdit.preco || productToEdit.price ? String(productToEdit.preco || productToEdit.price) : "");
    if (productToEdit.foto || productToEdit.imagem || productToEdit.image) {
    setImagemPreview(productToEdit.foto || productToEdit.imagem || productToEdit.image);
    }
    }
  }, [productToEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim() || !preco.trim()) {
      setErrorMsg("O nome e o preço do produto são obrigatórios.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("codigo_barras", codigoBarras);
      formData.append("preco", preco.replace(",", "."));

    if (imagemFile) {
    formData.append("foto", imagemFile);
    }

      if (isEditing && productToEdit?.id) {
        await productService.atualizar(productToEdit.id, formData);
        setSuccessMsg("Produto atualizado com sucesso!");
      } else {
        await productService.cadastrar(formData);
        setSuccessMsg("Produto cadastrado com sucesso!");
      }

      setTimeout(() => {
        onSuccess();
      }, 1200);

    } catch (err: any) {
      console.error("Erro ao salvar produto:", err);
      setErrorMsg(err.message || "Ocorreu um erro ao salvar o produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 bg-card border border-border rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl flex-1">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-2xl flex items-center gap-2">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Upload de Imagem com Fallback */}
          <div className="flex flex-col items-center justify-center">
            <label className="relative w-full h-48 bg-card border-2 border-dashed border-border rounded-3xl overflow-hidden cursor-pointer flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
              {imagemPreview ? (
                <ImageWithFallback
                  src={imagemPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-semibold">Tirar foto ou enviar imagem</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Produto *</Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Coca-Cola 2L"
              required
            />
          </div>

          {/* Código de Barras */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Código de Barras (EAN)</Label>
            <Input
              id="codigo"
              type="text"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              placeholder="Ex: 7894900011517"
            />
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$) *</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0.00"
              className="font-bold text-lg text-primary"
              required
            />
          </div>

          {/* Botão de Salvar (shadcn Button) */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 font-bold text-lg rounded-2xl shadow-lg shadow-primary/30"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Salvando...</span>
              </div>
            ) : (
              <span>{isEditing ? "Atualizar Produto" : "Cadastrar Produto"}</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}