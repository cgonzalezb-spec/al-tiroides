import { Pill, Clock, AlertCircle, Heart, ChevronDown, ShoppingCart, Pencil, Plus, Trash2, Upload, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle } from 'lucide-react';

interface MedicationDetailsProps {
  medication: any;
  medIndex: number;
  openDetails: number | null;
  setOpenDetails: (value: number | null) => void;
  openPrices: number | null;
  setOpenPrices: (value: number | null) => void;
  getPharmacyLinks: (key: string) => any[];
  selectedDose: Record<number, string>;
  setSelectedDose: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  showAllPrices: Record<string, boolean>;
  setShowAllPrices: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  pharmacyLogos: Record<string, string>;
  pharmacyLogosDb: Record<string, string>;
  isAdmin: boolean;
  uploadingLogo: string | null;
  handleLogoUpload: (pharmacyName: string, file: File) => Promise<void>;
  setEditingLink: (link: any) => void;
  setIsEditDialogOpen: (value: boolean) => void;
  setIsAddDialogOpen: (value: boolean) => void;
  deleteLinkMutation: any;
}

export const MedicationDetails = ({
  medication,
  medIndex,
  openDetails,
  setOpenDetails,
  openPrices,
  setOpenPrices,
  getPharmacyLinks,
  selectedDose,
  setSelectedDose,
  showAllPrices,
  setShowAllPrices,
  pharmacyLogos,
  pharmacyLogosDb,
  isAdmin,
  uploadingLogo,
  handleLogoUpload,
  setEditingLink,
  setIsEditDialogOpen,
  setIsAddDialogOpen,
  deleteLinkMutation
}: MedicationDetailsProps) => {
  return (
    <CardContent className="pt-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{medication.name}</h3>
        <p className="text-gray-600 mt-2">Información farmacológica detallada</p>
      </div>
      
      <div className="space-y-3 max-w-4xl mx-auto">
        <Collapsible 
          open={openDetails === medIndex} 
          onOpenChange={(isOpen) => setOpenDetails(isOpen ? medIndex : null)}
        >
          <CollapsibleTrigger asChild>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                Información farmacológica completa
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openDetails === medIndex ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4 grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                Farmacodinamia
              </h4>
              <p className="text-sm text-muted-foreground">{medication.pharmacodynamics}</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Farmacocinética
              </h4>
              <p className="text-sm text-muted-foreground">{medication.pharmacokinetics}</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Indicación terapéutica
              </h4>
              <p className="text-sm text-muted-foreground">{medication.therapeuticIndication}</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                Vías de administración
              </h4>
              <p className="text-sm text-muted-foreground">{medication.administrationRoutes}</p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                Reacciones adversas a medicamentos
              </h4>
              <ul className="space-y-1">
                {(medication.adverseReactions || []).map((reaction: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {reaction}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Contraindicaciones
              </h4>
              <ul className="space-y-1">
                {(medication.contraindications || []).map((contraindication: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {contraindication}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4 text-amber-600" />
                Interacciones medicamentosas
              </h4>
              <ul className="space-y-1">
                {(medication.interactions || []).map((interaction: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {interaction}
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible 
          open={openPrices === medIndex} 
          onOpenChange={(isOpen) => setOpenPrices(isOpen ? medIndex : null)}
        >
          <CollapsibleTrigger asChild>
            <button 
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Comparar precios en farmacias
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${openPrices === medIndex ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {(() => {
              const links = getPharmacyLinks(medication.medicationKey);
              
              const uniqueDoses = Array.from(new Set(
                links
                  .map(link => link.mg_per_tablet)
                  .filter(dose => dose && dose.trim() !== '')
                  .map(dose => {
                    const match = dose?.match(/(\d+)\s*mcg/i);
                    return match ? match[1] : null;
                  })
                  .filter(Boolean)
              )).sort((a, b) => parseInt(a!) - parseInt(b!));
              
              const currentDose = selectedDose[medIndex] || 'all';
              
              let filteredLinks = links;
              if (currentDose !== 'all') {
                filteredLinks = links.filter(link => {
                  const match = link.mg_per_tablet?.match(/(\d+)\s*mcg/i);
                  return match && match[1] === currentDose;
                });
              }
              
              const sortedLinks = [...filteredLinks].sort((a, b) => {
                if (a.pricePerUnit && b.pricePerUnit) {
                  return a.pricePerUnit - b.pricePerUnit;
                }
                return a.price - b.price;
              });
              
              const minPricePerUnit = sortedLinks.length > 0 && sortedLinks[0].pricePerUnit 
                ? sortedLinks[0].pricePerUnit 
                : null;
              
              return (
                <>
                  {uniqueDoses.length > 0 && (
                    <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Label className="text-sm font-medium shrink-0">
                          Filtrar por dosis:
                        </Label>
                        <Select
                          value={currentDose}
                          onValueChange={(value) => {
                            setSelectedDose(prev => ({ ...prev, [medIndex]: value }));
                          }}
                        >
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Todas las dosis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las dosis</SelectItem>
                            {uniqueDoses.map(dose => (
                              <SelectItem key={dose} value={dose!}>
                                {dose} mcg
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {sortedLinks.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay información de precios disponible para este medicamento.
                    </p>
                  ) : (
                    <div className="grid gap-4">
                      {(() => {
                        const grouped: Record<string, typeof sortedLinks> = {};
                        sortedLinks.forEach(link => {
                          const key = link.pharmacy_name || link.name;
                          if (!grouped[key]) {
                            grouped[key] = [];
                          }
                          grouped[key].push(link);
                        });
                        
                        return Object.entries(grouped).map(([pharmacyName, items]) => {
                          const pharmacyKey = `${medication.medicationKey}-${pharmacyName}`;
                          const showAll = showAllPrices[pharmacyKey] || false;
                          const displayItems = showAll ? items : items.slice(0, 3);
                          const hasMore = items.length > 3;
                          
                          return (
                            <Card key={pharmacyName} className="overflow-hidden">
                              <CardHeader className="pb-3 bg-muted/30">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {(pharmacyLogosDb[pharmacyName] || pharmacyLogos[pharmacyName]) && (
                                      <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded p-1">
                                        <img 
                                          src={pharmacyLogosDb[pharmacyName] || pharmacyLogos[pharmacyName]} 
                                          alt={pharmacyName}
                                          className="max-w-full max-h-full object-contain"
                                        />
                                      </div>
                                    )}
                                    <CardTitle className="text-base">{pharmacyName}</CardTitle>
                                  </div>
                                  {isAdmin && (
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleLogoUpload(pharmacyName, file);
                                          }
                                        }}
                                        disabled={uploadingLogo === pharmacyName}
                                      />
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        disabled={uploadingLogo === pharmacyName}
                                        asChild
                                      >
                                        <span>
                                          {uploadingLogo === pharmacyName ? (
                                            <>Subiendo...</>
                                          ) : (
                                            <>
                                              <Upload className="w-3 h-3 mr-1" />
                                              Logo
                                            </>
                                          )}
                                        </span>
                                      </Button>
                                    </label>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="divide-y">
                                  {displayItems.map((link, linkIndex) => {
                                    const isBestValue = link.pricePerUnit === minPricePerUnit && minPricePerUnit !== null;
                                    
                                    return (
                                      <div key={linkIndex} className="p-4 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-center justify-between gap-4">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                              <p className="font-medium text-sm truncate">
                                                {link.commercial_name || link.presentation}
                                              </p>
                                              {link.is_bioequivalent && (
                                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                                  Bioequivalente
                                                </Badge>
                                              )}
                                              {isBestValue && (
                                                <Badge variant="default" className="text-xs">
                                                  Mejor precio
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                              {link.laboratory && (
                                                <span>Lab: {link.laboratory}</span>
                                              )}
                                              <span>{link.presentation}</span>
                                              {link.quantity && link.pricePerUnit && (
                                                <span className="text-primary font-medium">
                                                  ${link.pricePerUnit.toLocaleString('es-CL')} por comprimido
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="text-right">
                                              <p className="font-bold text-lg text-primary">
                                                ${link.price.toLocaleString('es-CL')}
                                              </p>
                                              {link.quantity && (
                                                <p className="text-xs text-muted-foreground">
                                                  {link.quantity} comp.
                                                </p>
                                              )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                              <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="h-8 px-2"
                                                onClick={() => window.open(link.url, '_blank')}
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                              </Button>
                                              {isAdmin && (
                                                <>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 px-2"
                                                    onClick={() => {
                                                      setEditingLink({
                                                        id: link.id!,
                                                        medication_name: link.medication_name!,
                                                        pharmacy_name: link.pharmacy_name!,
                                                        presentation: link.presentation,
                                                        quantity: link.quantity?.toString() || '',
                                                        price: link.price.toString(),
                                                        product_url: link.url,
                                                        commercial_name: link.commercial_name || '',
                                                        laboratory: link.laboratory || '',
                                                        mg_per_tablet: link.mg_per_tablet || '',
                                                        is_bioequivalent: link.is_bioequivalent || false,
                                                      });
                                                      setIsEditDialogOpen(true);
                                                    }}
                                                  >
                                                    <Pencil className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 px-2"
                                                    onClick={() => {
                                                      if (window.confirm('¿Estás seguro de eliminar este enlace?')) {
                                                        deleteLinkMutation.mutate(link.id!);
                                                      }
                                                    }}
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {hasMore && (
                                  <div className="p-4 bg-muted/20 border-t">
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                      onClick={() => setShowAllPrices(prev => ({ ...prev, [pharmacyKey]: !showAll }))}
                                    >
                                      {showAll ? 'Ver menos opciones' : `Ver ${items.length - 3} opciones más`}
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}
                    </div>
                  )}
                    
                  {isAdmin && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Medicamento
                      </Button>
                    </div>
                  )}

                  <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>
                        La opción marcada como "Mejor precio" tiene el costo por comprimido más bajo.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Los precios son referenciales y pueden variar. Verifica el precio final en cada farmacia.
                      </span>
                    </p>
                  </div>
                </>
              );
            })()}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </CardContent>
  );
};
