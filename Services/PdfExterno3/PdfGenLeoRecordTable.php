<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PdfGenLeoRecordTable {
    protected $record   = null;
    protected $first    = true;
    public function  __construct($record) {
        $this->record=$record;
    }
    /**
     * el parametro por compatibilidad con RecordSet
     * @param type $ComoObjeto
     * @return stdclass
     */
    public function getRegistro($ComoObjeto=true){
        $aux = current($this->record);
        if (is_object($aux) ) {
            return (array) $aux;
        }
        return $aux;
    }
    public function next() {
        if (is_array($this->record)) {
            if ($this->first==true) {
                $this->first=false;
                $aux = current($this->record);
            }else{
                $aux = next($this->record);
            }
            if (is_object($aux) ) {
                return (array) $aux;
            }
            return $aux;
        }else{
            return false;
        }
    }
}
?>