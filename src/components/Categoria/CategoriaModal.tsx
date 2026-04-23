import React, { useState, useEffect } from 'react';
import type { Categoria, CategoriaCreate } from '../../types/categoria';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cat: CategoriaCreate) => void;
  categoriasDisponibles: Categoria[];
  categoriaParaEditar?: Categoria | null;
}

export const CategoriaModal = ({ isOpen, onClose, onSubmit, categoriasDisponibles, categoriaParaEditar }: Props) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [parentId, setParentId] = useState('');

  useEffect(() => {
    if (categoriaParaEditar) {
      setNombre(categoriaParaEditar.nombre);
      setDescripcion(categoriaParaEditar.descripcion);
      setImagenUrl(categoriaParaEditar.imagen_url);
      setParentId(categoriaParaEditar.parent_id === null ? '' : String(categoriaParaEditar.parent_id));
    } else {
      setNombre('');
      setDescripcion('');
      setImagenUrl('');
      setParentId('');
    }
  }, [categoriaParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      parent_id: parentId === '' ? null : Number(parentId),
      nombre,
      descripcion,
      imagen_url: imagenUrl,
    });
    onClose();
  };

  const parentCandidates = categoriasDisponibles.filter((categoria) => categoria.id !== categoriaParaEditar?.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-brand-dark border border-neon-amber shadow-neon w-full max-w-md rounded-xl p-8">
        <h2 className="text-neon-amber text-2xl font-bold mb-6 uppercase italic tracking-tighter">
          {categoriaParaEditar ? 'Editar Categoría' : 'Añadir Categoría'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-brand-cream/60 text-xs uppercase tracking-widest mb-2">Nombre de la categoría</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-brand-gray/20 border border-brand-gray/50 rounded p-3 text-brand-cream focus:border-neon-amber outline-none transition-all"
            />
          </div>
          
          <div>
            <label className="block text-brand-cream/60 text-xs uppercase tracking-widest mb-2">Descripción</label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-brand-gray/20 border border-brand-gray/50 rounded p-3 text-brand-cream focus:border-neon-amber outline-none transition-all h-32 resize-none"
            />
          </div>

          <div>
            <label className="block text-brand-cream/60 text-xs uppercase tracking-widest mb-2">Imagen URL</label>
            <input
              type="url"
              required
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full bg-brand-gray/20 border border-brand-gray/50 rounded p-3 text-brand-cream focus:border-neon-amber outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-brand-cream/60 text-xs uppercase tracking-widest mb-2">Categoría padre</label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-brand-gray/20 border border-brand-gray/50 rounded p-3 text-brand-cream focus:border-neon-amber outline-none transition-all"
            >
              <option value="">Sin padre (raíz)</option>
              {parentCandidates.map((categoria) => (
                <option key={categoria.id} value={categoria.id} className="bg-brand-dark">
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-brand-cream/50 hover:text-brand-cream transition-colors uppercase text-sm font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-neon-amber text-brand-dark px-8 py-2 rounded font-bold uppercase hover:bg-neon-amber/80 transition-all shadow-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};